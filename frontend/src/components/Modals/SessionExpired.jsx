import { Modal, Fade, Button, Paper, Typography } from "@mui/material";
import { useAuth } from "../../utils/AuthContext";

const SessionExpired = () => {
  const {
    isSessionExpiredOpen,
    setIsSessionExpiredOpen,
    setAuth,
    setUserData,
  } = useAuth();

  return (
    <Modal
      open={isSessionExpiredOpen}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={isSessionExpiredOpen}>
        <Paper
          elevation={5}
          className="flex flex-col items-center gap-6 rounded-2xl bg-[#f3f2ef] p-8 text-center shadow-lg"
          sx={{ width: 400 }}
        >
          {/* Title */}
          <Typography variant="h5" fontWeight="bold" color="#0073b1">
            Session Expired
          </Typography>

          {/* Subtitle */}
          <Typography variant="body1" color="textSecondary">
            Your session has expired. Please log in again to continue.
          </Typography>

          {/* Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0073b1",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              padding: "12px 30px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#005582",
              },
            }}
            onClick={() => {
              localStorage.removeItem("userData");
              setAuth(false);
              setUserData(null);
              setIsSessionExpiredOpen(false);
            }}
          >
            Re-Login
          </Button>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default SessionExpired;
