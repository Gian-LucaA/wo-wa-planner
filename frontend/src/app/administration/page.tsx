import SideBar from "@/components/sideBar";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import SingleBedRoundedIcon from "@mui/icons-material/SingleBedRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";

export default async function Page() {
  const buttons = [
    {
      icon: <GroupAddRoundedIcon />,
      label: "Pending Users",
      link: "/pendingUsers",
    },
    {
      icon: <GroupRoundedIcon />,
      label: "Users",
      link: "/users",
    },
    {
      icon: <SingleBedRoundedIcon />,
      label: "Places",
      link: "/places",
    },
    {
      icon: <SettingsRoundedIcon />,
      label: "Settings",
      link: "/settings",
    },
  ];

  return (
    <div>
      <SideBar buttons={buttons} />
    </div>
  );
}
