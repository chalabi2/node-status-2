import { useState, useEffect } from "react";
import { MachineContainer, StatusIndicator } from "./styled";

export type MachineProps = {
  filter(arg0: (m: any) => boolean): never[];
  name: string;
  ip: string;
  onClick: () => void;
};

export const Machine = ({ name, ip, onClick }: MachineProps) => {
  const [catchingUp, setCatchingUp] = useState<null | boolean>(null);

  useEffect(() => {
    fetch(`/api/fetch-status?ip=${ip}`)
      .then((response) => response.json())
      .then((data) => {
        setCatchingUp(data.result.sync_info.catching_up);
      });
  }, [ip]);

  return (
    <MachineContainer onClick={onClick}>
      <div>{name}</div>
      <StatusIndicator catchingUp={catchingUp} />
    </MachineContainer>
  );
};
