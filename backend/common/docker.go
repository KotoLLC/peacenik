package common

import (
	"context"
	"os"
	"strings"

	"github.com/ansel1/merry"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

func CurrentContainer(ctx context.Context) (*Container, error) {
	if !insideDocker() {
		return nil, nil
	}

	host, err := os.Hostname()
	if err != nil {
		return nil, merry.Wrap(err)
	}
	containers, err := listContainers(ctx, func(c Container) bool {
		return strings.HasPrefix(c.ID(), host)
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}
	if len(containers) == 0 {
		return nil, nil
	}

	return &containers[0], nil
}

func insideDocker() bool {
	return os.Getpid() == 1
}

func listContainers(ctx context.Context, filter func(c Container) bool) ([]Container, error) {
	cli, err := client.NewEnvClient()
	if err != nil {
		return nil, merry.Wrap(err)
	}
	containers, err := cli.ContainerList(ctx, types.ContainerListOptions{All: true})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	result := make([]Container, 0, len(containers))
	for _, c := range containers {
		containerInfo, err := cli.ContainerInspect(ctx, c.ID)
		if err != nil {
			continue
		}

		imageInfo, _, err := cli.ImageInspectWithRaw(ctx, containerInfo.Image)
		if err != nil {
			continue
		}

		c := Container{containerInfo: &containerInfo, imageInfo: &imageInfo}

		if filter(c) {
			result = append(result, c)
		}
	}

	return result, nil
}

type Container struct {
	containerInfo *types.ContainerJSON
	imageInfo     *types.ImageInspect
}

func (c Container) ID() string {
	return c.containerInfo.ID
}

func (c Container) ImageCreated() string {
	return c.imageInfo.Created
}
