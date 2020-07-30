package common

import (
	"fmt"
	"io/ioutil"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

const (
	defaultFPS = 30
)

var (
	streamInfoRe      = regexp.MustCompile(`^Stream .* Video: .*, (\d+)x(\d+)[, ].*, (\d+(\.\d+)?) fps, .*`)
	streamInfoNoFPSRe = regexp.MustCompile(`^Stream .* Video: .*, (\d+)x(\d+)[, ].*`)
	durationRe        = regexp.MustCompile(`^Duration: ((\d+):(\d+):(\d+)(.(\d+))?), .*`)
)

func VideoThumbnail(videoPath string) ([]byte, error) {
	tempDir, err := ioutil.TempDir("", "")
	if err != nil {
		return nil, err
	}
	defer func() { _ = os.RemoveAll(tempDir) }()

	outputPath := filepath.Join(tempDir, "thumbnail.jpg")
	const defaultPosition = "00:00:05.000"

	cmd := exec.Command("ffmpeg", "-i", videoPath, "-vframes", "1", "-ss", defaultPosition, outputPath)
	err = cmd.Run()
	if err != nil {
		return nil, err
	}

	_, err = os.Stat(outputPath)
	if err != nil {
		if !os.IsNotExist(err) {
			return nil, err
		}
		_, _, duration, _, err := videoMetadata(videoPath)
		if err != nil {
			return nil, err
		}

		if duration == 0 {
			return nil, nil
		}

		position := duration / 2
		minutes := int(position.Minutes()) % 60
		seconds := int(position.Seconds()) % 60
		milliseconds := int(position.Milliseconds()) % 1000
		cmd := exec.Command("ffmpeg", "-i", videoPath, "-vframes", "1", "-ss", fmt.Sprintf("00:%02d:%02d.%03d", minutes, seconds, milliseconds), outputPath)
		err = cmd.Run()
		if err != nil {
			return nil, err
		}
	}

	data, err := ioutil.ReadFile(outputPath)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func videoMetadata(videoPath string) (width, height int, duration time.Duration, fps float64, err error) {
	cmd := exec.Command("ffmpeg", "-i", videoPath)
	output, _ := cmd.CombinedOutput()

	width, height, duration, fps, ok := parseVideoMetadata(string(output))

	if !ok {
		return -1, -1, 0, 0, fmt.Errorf("can't obtain video metadata for '%s'", videoPath)
	}

	return width, height, duration, fps, nil
}

func parseVideoMetadata(output string) (width, height int, duration time.Duration, fps float64, ok bool) {
	lines := strings.Split(output, "\n")
	hasDuration, hasMetadata := false, false
	for _, line := range lines {
		if hasDuration && hasMetadata {
			break
		}

		line = strings.TrimSpace(line)

		var infoRE *regexp.Regexp
		if strings.Contains(line, " fps, ") {
			infoRE = streamInfoRe
		} else {
			infoRE = streamInfoNoFPSRe
		}

		match := infoRE.FindStringSubmatch(line)
		if match != nil {
			width, _ = strconv.Atoi(match[1])
			height, _ = strconv.Atoi(match[2])
			if infoRE == streamInfoNoFPSRe {
				fps = defaultFPS
			} else {
				fps, _ = strconv.ParseFloat(match[3], 64)
			}
			hasMetadata = true
		}

		match = durationRe.FindStringSubmatch(line)
		if match != nil {
			hours, _ := strconv.Atoi(match[2])
			minutes, _ := strconv.Atoi(match[3])
			seconds, _ := strconv.Atoi(match[4])
			underSeconds, _ := strconv.Atoi(match[6])
			duration = time.Hour*time.Duration(hours) + time.Minute*time.Duration(minutes) + time.Second*time.Duration(seconds) +
				time.Duration(underSeconds)*(time.Second/time.Duration(math.Pow10(len(match[6]))))
			hasDuration = true
		}
	}

	if !hasDuration || !hasMetadata {
		return -1, -1, 0, 0, false
	}

	return width, height, duration, fps, true
}
