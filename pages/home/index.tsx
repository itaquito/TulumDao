import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { AiFillPlayCircle, AiFillStar } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import Masonry from 'react-masonry-css';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styled from 'styled-components';
import masonry from '../../src/assets/data/masonary.json';
import reviews from '../../src/assets/data/review.json';
import team from '../../src/assets/data/team.json';
import { BtnGreen } from "../../src/components/BtnGreen";

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 110px;
  height: 110px;
  object-fit: cover;
`;

const TeamCard = styled(Container)`
  border: 1px solid #B8B8B8;
  border-radius: 10%;
  min-height: 10rem;
  max-height: 20rem;
  min-width: 10rem;
  max-width: 18rem;
`;

const ValorationCard = styled(Container)`
  border: 1px solid #B8B8B8;
  border-radius: 75px;
  width: 95%;
  height: auto;
`;

const HihglightCol = styled(Row)`
  margin-top: 0;

  @media (min-width: 992px) {
    margin-top: -12rem;
  }
`;

const teamDisplay = team.map(member => {
  return (
    <Col sm={6} md={4} className='py-3' key={member.name}>
      <TeamCard className= {member.shadow + ' py-5'}>
        <ProfileImage src={member.img} className='mx-auto d-block' />
        <h5 className='text-center pt-4 pb-2'>{member.name}</h5>
        <p className='text-center text-muted'>{member.job}</p>
      </TeamCard>
    </Col>
  );
});

const masonryDisplay = masonry.map(element => {
  return(
    <Card.Img src={"https://drive.google.com/uc?export=view&id=" + element.id} key={element.id} alt={"Image preview"} className="img-fluid pb-1" />
  );
})

const reviewDisplay = reviews.map(review => {
  return(
    <Container key={review.name}>
      <ValorationCard className='py-5 mx-auto'>
        <ProfileImage src={review.image} className='mx-auto d-block mt-3' />
        <div className="w-50 mx-auto d-flex justify-content-evenly py-3">
            <AiFillStar color="FFC107" size={24} />
            <AiFillStar color="FFC107" size={24} />
            <AiFillStar color="FFC107" size={24} />
            <AiFillStar color="FFC107" size={24} />
            <AiFillStar color="FFC107" size={24} />
        </div>
        <p className="text-center">
          <small>
            “{review.message}
          </small>
        </p>
        <p className="text-center my-0">
          {review.name}
        </p>
        <p className="text-center">
          <small>
            {review.job}
          </small>
        </p>
      </ValorationCard>
    </Container>
  );
})

const Highlight = () => {
  return(
    <Stack direction="horizontal" gap={3}>
      <h1 className="fw-bold h1">01</h1>
      <div>
        <h1 className="fw-bold h5">Funding Vouchers</h1>
        <p className="lead">
          <small>
            Los tokens de inversión heredan todas las cualidades de un token ERC-721 y ERC-20.
          </small>
        </p>
        <Link href='/'>
          Ver en Etherscan <FiExternalLink />
        </Link>
      </div>
    </Stack>
  );
}

const breakpointColumnsObj = {
  default: 3,
  700: 2,
  500: 1
};

export default function Home() {
  const { push } = useRouter()
  // Carrousel
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 5,
    speed: 500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2
        }
      }
    ]
  };

  return (
    <>
      {/* Presentation */}
      <Container className='flex-lg-row-reverse align-items-center g-5 py-5'>
        <Row className='flex-lg-row-reverse align-items-center g-5 py-5'>
          <Col className='col-10 col-sm-8 col-lg-6'>
            <img src="https://drive.google.com/uc?export=view&id=1ncS8AN7xsO8nrGPCMwGMYP4c6os1sdmM" className="d-block mx-lg-auto img-fluid rounded" alt="" loading="lazy" />
          </Col>
          <Col className='col-lg-6'>
            <div className="lc-block mb-3">
              <div>
                <h1 className="fw-bold h1">Reserva</h1>
                <h1 className="fw-bold h1">Kaax</h1>
              </div>
            </div>
            <BtnGreen>Descargar Whitepaper</BtnGreen>
          </Col>
        </Row>
      </Container>

      {/* Localization */}
      <Container className='flex-lg-row-reverse align-items-center g-5 py-5'>
        <Row className='flex-lg-row-reverse align-items-center g-5 py-5'>
          <Col className='col-lg-6'>
            <div className="lc-block mb-3">
              <h1 className="fw-bold h2">Localizado en Tulum Country Club</h1>
            </div>
            <div className="lc-block mb-3">
              <div>
                <p className="lead">
                  La obra se construye en 1 año y medio, las ganancias empiezan a distribuirse despues de vender el primer departamento. Cada acción esta respaldada por un documento físico que comprueba que tu token es dueña de dicha acción.
                </p>
              </div>
            </div>
            <Stack direction="horizontal" gap={3}>
              <BtnGreen onClick={()=>push("/investment")}>Invertir</BtnGreen>
              <div><AiFillPlayCircle size={50} color={'#A9D9CE'} /> Ver vídeos</div>
            </Stack>
          </Col>
          <Col className='col-10 col-sm-8 col-lg-6'>
            <img src="https://drive.google.com/uc?export=view&id=10RDBBwoeNMMQXaVQ4kpWnyw88qa869Kj" className="d-block mx-lg-auto img-fluid rounded" alt="" loading="lazy" />
          </Col>
        </Row>
      </Container>

      {/* Highlights */}
      <Container className='flex-lg-row-reverse align-items-center g-5'>
        <h1 className="fw-bold h2 pb-3">Highlights del proyecto</h1>
        <Row className='flex-lg-row-reverse align-items-center g-5 pt-5'>
          <HihglightCol className='col-12 col-sm-10 col-lg-6'>
            <Stack gap={4}>
              <Highlight />
              <Stack direction="horizontal" gap={3}>
                <h1 className="fw-bold h1">02</h1>
                <div>
                  <h1 className="fw-bold h5">Contrato Escrow</h1>
                  <p className="lead">
                    <small>
                      Los tokens de inversión heredan todas las cualidades de un token ERC-721 y ERC-20.
                    </small>
                  </p>
                </div>
              </Stack>
              <Stack direction="horizontal" gap={3}>
                <h1 className="fw-bold h1">03</h1>
                <div>
                  <h1 className="fw-bold h5">Ventajas y recompensas</h1>
                  <p className="lead">
                    Todo inversionista dueño de al menos 1 Funding Voucher será recompensado con acceso exclusivo a un beach party con Marshmellow y Harry Styles
                  </p>
                </div>
              </Stack>
            </Stack>
          </HihglightCol>
          <Col className='col-12 col-sm-8 col-lg-6'>
            <div className="hstack gap-3">
              <h1 className="fw-bold h1">04</h1>
              <div>
                <h1 className="fw-bold h5">Infraestructura - parada del tren MAYA</h1>
                <p className="lead">
                  Una gran ventaja del inmueble es que va a estar muy cerca de la parada de tren MAYA, el proyecto nacional mas grande del país.
                </p>
              </div>
            </div>
            <div className="hstack gap-3">
              <h1 className="fw-bold h1">05</h1>
              <div>
                <h1 className="fw-bold h5">Amenidades espectaculares</h1>
                <p className="lead">
                  Cenotes naturales, golf, huerto, vivero, temezcal, spa, bar, restaurant, delivery, zonas de yoga, gimnasio, anidación y conservación oficial de tortugas marinas y mucho mas.
                </p>
              </div>
            </div>
            <div className="hstack gap-3">
              <h1 className="fw-bold h1">06</h1>
              <div>
                <h1 className="fw-bold h5">Ventajas y recompensas</h1>
                <p className="lead">
                  Todo inversionista dueño de al menos 1 Funding Voucher será recompensado con acceso exclusivo a un beach party con Marshmellow y Harry Styles
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className='flex-lg-row-reverse align-items-center g-5 py-5'>
        <Row className='flex-lg-row-reverse align-items-center g-5 py-5'>
          <Col className='col-10 col-sm-8 col-lg-6'>
            <img src="https://drive.google.com/uc?export=view&id=1eSNrY8h0AMyAiK5Y5f7Mk_rMjN0qAxf9" className="d-block mx-lg-auto img-fluid rounded" alt="" loading="lazy" />
          </Col>
          <Col className='col-lg-6'>
            <div className="lc-block mb-3">
              <div>
                <h1 className="fw-bold h2">Todo es transparente en Ethereum y gestionado por constructura XYZ</h1>
              </div>
            </div>
            <div className="lc-block mb-3">
              <div>
                <p className="lead">
                  But I must explain to you how all thismistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system.
                </p>
              </div>
            </div>
            <div className="lc-block d-grid gap-2 d-md-flex justify-content-md-start">
              <a className="btn btn-primary px-4 me-md-2" href="#" role="button" style={{backgroundColor: '#122620'}}>Leer más</a>
            </div>
          </Col>
        </Row>
      </Container>
      {/* Equipo */}
      <Container>
        <h1 className='fw-bold h2 text-center pb-5'>Conoce al equipo</h1>
        <Row>
          { teamDisplay }
        </Row>
      </Container>
      {/* Gallery */}
      <Container>
        <h1 className='fw-bold h2 text-center pb-5'>Galería de la obra</h1>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
            { masonryDisplay }
        </Masonry>
      </Container>

      <h1 className='fw-bold h2 text-center pt-5'>Testimonios</h1>
      <h1 className='fw-bold h5 text-center pb-5'>Voces de clientes nacionales</h1>
      <Slider {...settings}>
        { reviewDisplay }
      </Slider>

      <Container className='flex-lg-row-reverse align-items-center g-5 py-5'>
        <Row className='flex-lg-row-reverse align-items-center g-5 py-5'>
          <Col className='col-lg-6'>
            <div className="lc-block mb-3">
              <div>
                <h1 className="fw-bold h2">Necesitas ayuda con tu decisión?</h1>
              </div>
            </div>
            <div className="mb-3">
              <Form>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
                <Button type="submit" style={{ backgroundColor: '#122620' }} >
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
          <Col className='col-10 col-sm-8 col-lg-6'>
            <img src="https://drive.google.com/uc?export=view&id=10RDBBwoeNMMQXaVQ4kpWnyw88qa869Kj" className="d-block mx-lg-auto img-fluid rounded" alt="" loading="lazy" />
          </Col>
        </Row>
      </Container>
    </>
  );
}
