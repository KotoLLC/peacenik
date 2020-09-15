package common

import (
	"image"
	"io"

	"github.com/disintegration/imaging"
	"github.com/rwcarlsen/goexif/exif"
)

func DecodeImageAndFixOrientation(reader io.Reader, orientation string) (image.Image, error) {
	img, _, err := image.Decode(reader)
	if err != nil {
		return nil, err
	}
	switch orientation {
	case "2":
		img = imaging.FlipH(img)
	case "3":
		img = imaging.Rotate180(img)
	case "4":
		img = imaging.Rotate180(imaging.FlipH(img))
	case "5":
		img = imaging.Rotate270(imaging.FlipV(img))
	case "6":
		img = imaging.Rotate270(img)
	case "7":
		img = imaging.Rotate90(imaging.FlipV(img))
	case "8":
		img = imaging.Rotate90(img)
	}
	return img, nil
}

func GetImageOrientation(reader io.Reader) string {
	exifData, err := exif.Decode(reader)
	if err != nil || exifData == nil {
		return "1"
	}
	orientation, err := exifData.Get(exif.Orientation)
	if err != nil || orientation == nil {
		return "1"
	}
	return orientation.String()
}
