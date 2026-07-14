import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GalleryRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/media-and-resources#gallery", { replace: true });
  }, [navigate]);
  
  return null;
}
