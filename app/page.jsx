"use client";
import * as React from "react";
import { Poppins } from "next/font/google";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import {
  Container,
  Grid,
  Typography,
  Card,
  CardActionArea,
} from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
// import { Link } from "react-router-dom";
const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});
const Header = () => {
  return (
    <nav className="w-full fixed z-50">
      <header className="header w-full">
        <Grid container spacing={0}>
          <Grid item ml={0} className="w-full">
            <div className="flex justify-between w-full  items-center ">
              <Image alt="logo" src={"/logo.png"} width={80} height={80} />

              <Link href={"/login"}>
                <Button
                  type="button"
                  variant="purpule"
                  color="secondary"
                  className={cn(
                    "px-5 text-[15px] py-[0px] rounded-sm  mt-3  ",
                    font.className
                  )}
                  sx={{
                    width: 200,
                    ml: 30,
                    mt: 10,
                    backgroundColor: "#5313D2",
                  }}
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </Grid>
        </Grid>
      </header>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="back max-w-full ">
      <Box className="container">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                color: "#FFFFFF",
                mt: 23,
                marginLeft: 5,
                fontFamily: "initial",
              }}
            >
              Bienvenue sur votre
              <br />
              espace de planification <br />
              des soutenances
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                color: "#FFFFFF",
                mt: 7,
                marginLeft: 5,
                marginBottom: 12,
                fontFamily: "initial",
              }}
            >
              Accéder a votre compte dès maintenant , Consulter votre planning,
              Gagnez du temps <br />
              et restez organisé, Améliorez la collaboration et
              l&apos;efficacité <br /> Nous sommes là pour vous !
            </Typography>

            <Link
              href="#feature-section"
              className="w-full flex justify-center  items-end"
            >
              <Button
                className={cn(
                  "px-8 text-[19px]   py-0.5  rounded-full uppercase shadow-md",
                  font.className
                )}
                variant="purpule"
                color="secondary"
                sx={{ width: 200, ml: 30, mt: 10, backgroundColor: "#5313D2" }}
              >
                DÉCOUVRIR PLUS
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

const scaleUp = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100%);
  
  }
  to {
    opacity: 1;
    transform: translateX(0);
    
  }
`;
const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%); /* Start off-screen to the right */
  }
  to {
    opacity: 1;
    transform: translateX(0); /* Animate to visible and in place */
  }
`;

const AnimatedTypography = styled(Typography)`
  animation: ${slideInFromRight} 2s ease-in-out; /* Apply the animation */
  display: inline-block; /* Ensure text is displayed inline */
`;
const AnimatedTypography2 = styled(Typography)`
  animation: ${slideInFromLeft} 2s ease-in-out; /* Apply the animation */
  display: inline-block; /* Ensure text is displayed inline */
`;
const AnimatedCard = styled(Card)`
  &:hover {
    animation: ${scaleUp} 0.3s ease-in-out forwards;
  }
`;

const Feature = () => {
  return (
    <section id="feature-section" className="features mb-0 pb-0">
      <Container maxWidth="lg">
        <AnimatedTypography
          variant="h2"
          component="h2"
          align="center"
          sx={{ mt: 15, color: "#FFFFFF", fontFamily: "initial" }}
        >
          Découvrir notre platefrome !
        </AnimatedTypography>
        <Grid container spacing={3} sx={{ marginTop: 4 }}>
          <Box display={"flex"}>
            <Grid item xs={12} md={15} mt={11}>
              <AnimatedCard className="feature-card bg-transparent">
                <CardActionArea className="bg-transparent">
                  <AnimatedCard className="gri bg-transparent" />
                </CardActionArea>
              </AnimatedCard>
            </Grid>
            <AnimatedTypography2
              variant="h2"
              component="h2"
              sx={{
                color: "#6523E6",
                mt: 15,
                marginLeft: 3,
                fontFamily: "fantasy",
              }}
            >
              Gagnez de temps et restez organisé
              <Typography variant="body2" sx={{ mt: 5 }}>
                Dites adieu aux démarches administratives fastidieuses et aux
                difficultés de communication. Notre plateforme vous permet de
                centraliser toutes les informations liées aux soutenances,
                facilitant ainsi la gestion et le suivi de chaque étape.
              </Typography>
            </AnimatedTypography2>
          </Box>

          <Box display={"flex"}>
            <AnimatedTypography
              variant="h2"
              component="h2"
              sx={{
                color: "#6887F9",
                mt: 16,
                marginLeft: 1,
                fontFamily: "fantasy",
              }}
            >
              Améliorez la collaboration et l&apos;efficacité
              <Typography variant="body2" sx={{ mt: 5 }}>
                Favorisez une communication fluide entre les étudiants, les
                enseignants et les administrateurs grâce à des outils intégrés
                de messagerie de partage des plannings, de choisir et proposer
                des thèmes. Collaborez efficacement et assurez-vous que tout le
                monde est informé des dernières mises à jour et des échéances
                importantes.
              </Typography>
            </AnimatedTypography>
            <Grid
              item
              xs={12}
              md={15}
              mt={15}
              ml={2}
              className="bg-transparent"
            >
              <AnimatedCard className="feature-card bg-transparent">
                <CardActionArea>
                  <AnimatedCard className="gri1 bg-transparent" />
                </CardActionArea>
              </AnimatedCard>
            </Grid>
          </Box>

          <div className="flex items-center justify-between">
            <Grid item xs={12} md={15} mt={15} ml={2}>
              <AnimatedCard className="feature-card bg-transparent">
                <CardActionArea>
                  <AnimatedCard className="gri2 " />
                </CardActionArea>
              </AnimatedCard>
            </Grid>
            <AnimatedTypography2
              variant="h2"
              component="h2"
              sx={{
                color: "#ADD8E6",
                mt: 15,
                marginLeft: 3,
                fontFamily: "fantasy",
              }}
            >
              Profitez d&apos;une expérience utilisateur intuitive
              <Typography variant="body2" sx={{ mt: 5 }}>
                Notre plateforme est conçue pour être conviviale et accessible à
                tous. Que vous soyez novice en informatique ou utilisateur
                expérimenté, vous pourrez naviguer facilement et profiter de
                toutes les fonctionnalités offertes en un seul clic.
              </Typography>
            </AnimatedTypography2>
          </div>

          <section className="parallax">
            <section className="log2" />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <p className="pGrad">Graduation Plan </p>
            <span>
              &ldquo;Un but sans plan n&apos;est qu&apos;un rêve&ldquo;
            </span>
          </section>
          <Box display={"flex"}>
            <AnimatedTypography
              variant="h2"
              component="h2"
              sx={{
                color: "#6523E6",
                mt: 15,
                marginLeft: -1,
                fontFamily: "fantasy",
              }}
            >
              Génération rapide et afficace de planning
              <Typography variant="body2" sx={{ mt: 5 }}>
                Créez un planning détaillé en quelques secondes grâce à notre
                outil de génération de planning rapide. Gagnez du temps et
                évitez les erreurs humaines en laissant notre plateforme
                organiser les soutenances de manière optimale, en tenant compte
                des disponibilités de chacun.Gardez une trace précise de toutes
                les modifications apportées aux plannings avec notre
                fonctionnalité d&apos;historique des versions.
              </Typography>
            </AnimatedTypography>
            <Grid item xs={12} md={15} mt={1} ml={-5}>
              <AnimatedCard className="feature-card bg-transparent">
                <CardActionArea>
                  <AnimatedCard className="gri3 bg-transparent" />
                </CardActionArea>
              </AnimatedCard>
            </Grid>
          </Box>

          <Box display={"flex"} mt={-17}>
            <Grid item xs={12} md={15}>
              <AnimatedCard className="feature-card bg-transparent">
                <CardActionArea>
                  <AnimatedCard className="gri4 bg-transparent" />
                </CardActionArea>
              </AnimatedCard>
            </Grid>
            <AnimatedTypography2
              variant="h2"
              component="h2"
              sx={{
                color: "#ADD8E6",
                mt: 16,
                marginLeft: 3,
                fontFamily: "fantasy",
              }}
            >
              Automatisation complète pour les enseignants
              <Typography variant="body2" sx={{ mt: 5 }}>
                Facilitez la vie des enseignants avec notre système entièrement
                automatisé. Proposez des thèmes, validez les choix des étudiants
                et gérez les soutenances sans effort. Tout le processus est
                simplifié, vous permettant de vous concentrer sur
                l&apos;essentiel : l&apos;accompagnement et l&apos;évaluation
                des étudiants.
              </Typography>
            </AnimatedTypography2>
          </Box>
        </Grid>
        <div className="h-[1px] w-full mx-2 bg-slate-700  mb-2 mt-3" />
        <div className="bg-[#17203f] flex flex-col  w-full mt-4 h-4 pb-0">
          <div className="w-full text-white flex justify-between items-center py-0  px-3">
            <Image alt="logo" src={"/logo.png"} width={80} height={80} />
            <p> Copyright © 2024 Gestion des soutenances</p>
          </div>
        </div>
      </Container>
    </section>
  );
};

// const Footer = () => {
//   return (
//     <footer className="bg-slate-950 h-44  w-full">
//       <div className="w-full bg-[#17203f] flex flex-col h-9">
//         Copyright © 2024 Gestion des soutenances
//       </div>
//     </footer>
//   );
// };

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />

      <Feature />
    </div>
  );
};

export default LandingPage;
