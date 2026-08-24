import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function ResponsiveView({ mobile, tablet, desktop }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  
  if (isMobile) return mobile;
  if (isTablet) return tablet;
  return desktop;
}
