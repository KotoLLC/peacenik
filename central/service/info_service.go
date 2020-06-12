package service

type InfoService interface {
	PublicKey() string
}

type infoService struct {
	pubKeyPem string
}

func NewInfo(pubKeyPem string) InfoService {
	return &infoService{
		pubKeyPem: pubKeyPem,
	}
}

func (s *infoService) PublicKey() string {
	return s.pubKeyPem
}
