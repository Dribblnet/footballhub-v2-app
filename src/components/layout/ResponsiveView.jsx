import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function ResponsiveView({ mobile, tablet, desktop }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  
  if (isMobile && mobile) return mobile;
  if (isTablet && tablet) return tablet;
  if (!isMobile && desktop) return desktop;
  
  // Fallbacks
  if (isMobile && tablet) return tablet;
  if (isMobile && desktop) return desktop;
  if (isTablet && desktop) return desktop;
  if (isTablet && mobile) return mobile;
  if (mobile) return mobile;
  return desktop || tablet || mobile || null;
}
