import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MediaRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/media-and-resources#media", { replace: true });
  }, [navigate]);
  
  return null;
}
