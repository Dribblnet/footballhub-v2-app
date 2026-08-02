import ResponsiveView from "../../components/layout/ResponsiveView";
import StatsHubDesktop from "./components/desktop/StatsHubDesktop";
import StatsHubTablet from "./components/tablet/StatsHubTablet";
import StatsHubMobile from "./components/mobile/StatsHubMobile";

export default function StatsHub() {
  return (
    <ResponsiveView
      desktop={<StatsHubDesktop />}
      tablet={<StatsHubTablet />}
      mobile={<StatsHubMobile />}
    />
  );
}
