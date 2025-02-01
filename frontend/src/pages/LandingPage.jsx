import { useNavigate } from "react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import {
  Rocket,
  Work,
  AccessAlarm,
  Notifications,
  Person,
  Search,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link } from "react-scroll"; // for smooth scroll

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll animation trigger
  const trigger = useScrollTrigger();

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* AppBar with Slide Animation */}
      <Slide direction="down" in={!trigger} timeout={500}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: trigger ? "#1F2A44" : "rgba(31, 42, 68, 0.8)",
            boxShadow: "none",
            transition: "background-color 0.3s ease",
          }}
        >
          <Toolbar
            sx={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "10px",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "24px",
              }}
            >
              Job Application System
            </Typography>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Link to="features" smooth={true} duration={500}>
                  <Button sx={{ color: "#fff", fontWeight: 600 }}>
                    Features
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="how-it-works" smooth={true} duration={500}>
                  <Button sx={{ color: "#fff", fontWeight: 600 }}>
                    How It Works
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="testimonials" smooth={true} duration={500}>
                  <Button sx={{ color: "#fff", fontWeight: 600 }}>
                    Testimonials
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="coming-soon" smooth={true} duration={500}>
                  <Button sx={{ color: "#fff", fontWeight: 600 }}>
                    Coming Soon
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Button
                  sx={{
                    color: "#fff",
                    border: "1px solid #fff",
                    fontWeight: 600,
                    marginLeft: "20px",
                    borderRadius: "30px",
                  }}
                  onClick={() => handleNavigate("/signin")}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item>
                <Button
                  sx={{
                    color: "#1F2A44",
                    backgroundColor: "#fff",
                    fontWeight: 600,
                    marginLeft: "10px",
                    borderRadius: "30px",
                    "&:hover": { backgroundColor: "#D9D9D9" },
                  }}
                  onClick={() => handleNavigate("/signup")}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Slide>

      {/* Hero Section */}
      <section
        id="hero"
        className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-teal-400 text-white text-center p-6"
      >
        <Container>
          <Typography variant="h2" sx={{ fontWeight: 700, marginBottom: 3 }}>
            Find Your Dream Job Today
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: 4 }}>
            Join thousands of professionals and get hired faster with our free
            platform.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: "12px 36px",
              borderRadius: "30px",
              fontSize: "16px",
              boxShadow: 3,
              "&:hover": { backgroundColor: "#005bb5" },
            }}
            onClick={() => handleNavigate("/signup")}
          >
            Get Started
          </Button>
        </Container>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="h-screen flex items-center bg-gray-100 py-16"
      >
        <Container>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              marginBottom: 6,
              color: "#1F2A44",
            }}
          >
            Our Key Features
          </Typography>
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: "center",
                  padding: "30px",
                  background: "#fff",
                  boxShadow: 6,
                  borderRadius: "12px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: 10,
                  },
                }}
              >
                <Rocket sx={{ fontSize: 50, color: "#1F2A44" }} />
                <Typography variant="h5" sx={{ marginTop: 3, fontWeight: 600 }}>
                  Easy Apply
                </Typography>
                <Typography sx={{ marginTop: 1 }}>
                  Apply to jobs with just one click. Simplifying your
                  application process.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: "center",
                  padding: "30px",
                  background: "#fff",
                  boxShadow: 6,
                  borderRadius: "12px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: 10,
                  },
                }}
              >
                <Notifications sx={{ fontSize: 50, color: "#1F2A44" }} />
                <Typography variant="h5" sx={{ marginTop: 3, fontWeight: 600 }}>
                  Job Alerts
                </Typography>
                <Typography sx={{ marginTop: 1 }}>
                  Get notified about new job openings tailored to your skills
                  and preferences.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  textAlign: "center",
                  padding: "30px",
                  background: "#fff",
                  boxShadow: 6,
                  borderRadius: "12px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: 10,
                  },
                }}
              >
                <AccessAlarm sx={{ fontSize: 50, color: "#1F2A44" }} />
                <Typography variant="h5" sx={{ marginTop: 3, fontWeight: 600 }}>
                  Resume Builder (Coming Soon)
                </Typography>
                <Typography sx={{ marginTop: 1 }}>
                  Create your resume in minutes with AI-powered templates
                  (Coming soon!).
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="h-screen bg-gray-100 py-16">
        <Container>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              marginBottom: 6,
              color: "#1F2A44",
            }}
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  padding: "30px",
                  background: "#fff",
                  boxShadow: 6,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontStyle: "italic", marginBottom: 3 }}>
                  "This platform helped me find a job in just a few weeks. The
                  process was so easy!"
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>John Doe</Typography>
                <Typography sx={{ color: "#6b7280" }}>
                  Software Engineer
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  padding: "30px",
                  background: "#fff",
                  boxShadow: 6,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontStyle: "italic", marginBottom: 3 }}>
                  "I love the job alert feature. It keeps me updated on the
                  latest openings."
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>Jane Smith</Typography>
                <Typography sx={{ color: "#6b7280" }}>
                  Product Manager
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  padding: "30px",
                  background: "#fff",
                  boxShadow: 6,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontStyle: "italic", marginBottom: 3 }}>
                  "Highly recommend for anyone looking for job opportunities.
                  The platform is user-friendly."
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>Alice Brown</Typography>
                <Typography sx={{ color: "#6b7280" }}>UX Designer</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Coming Soon Section */}
      <section id="coming-soon" className="h-screen bg-white py-16">
        <Container>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              marginBottom: 6,
              color: "#1F2A44",
            }}
          >
            Coming Soon
          </Typography>
          <Typography sx={{ textAlign: "center", marginTop: 2 }}>
            We're working hard to launch even more great features soon. Stay
            tuned!
          </Typography>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <Container>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Job Application System
              </Typography>
              <Typography>
                © 2025 Job Application System. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <Typography>Follow us on:</Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <a href="#" className="text-white hover:text-teal-400">
                    Facebook
                  </a>
                </Grid>
                <Grid item>
                  <a href="#" className="text-white hover:text-teal-400">
                    Twitter
                  </a>
                </Grid>
                <Grid item>
                  <a href="#" className="text-white hover:text-teal-400">
                    LinkedIn
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
