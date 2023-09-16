import { Machine, MachineProps } from "../index";
import { useState, useEffect } from "react";
import {
  AppContainer,
  InnerContainer,
  FilterContainer,
  MachinesContainer,
  ModalBackground,
  ModalContent,
  CloseButtonContainer,
} from "./styled";

const NodeMonitor = () => {
  const [newMachine, setNewMachine] = useState("");
  const [newChain, setNewChain] = useState("");
  const [newIp, setNewIp] = useState("");
  const [machines, setMachines] = useState<MachineProps[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<MachineProps | null>(
    null
  );

  const urlMachine = "/api/machines";
  const urlMachineAdd = "/api/add-machine";
  const urlMachineRemove = "/api/remove-machine";

  const handleMachineClick = (machine: MachineProps) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  const removeMachine = (machine: MachineProps) => {
    fetch(`${urlMachineRemove}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machine),
    })
      .then((response) => response.json())
      .then(() => {
        setMachines((prevMachines) =>
          prevMachines.filter(
            (m) => m.name !== machine.name && m.ip !== machine.ip
          )
        );
      });
  };

  const handleRemoveNode = (machineToRemove: MachineProps) => {
    removeMachine(machineToRemove);

    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch(`${urlMachine}`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Not authenticated");
        } else if (!response.ok) {
          throw new Error("Some other error");
        }
        return response.json();
      })
      .then((data) => setMachines(data))
      .catch((error) => {
        if (error.message === "Not authenticated") {
          window.location.href = "https://status.chandrastation.com/api/login";
        } else {
          console.error(error.message);
        }
      });
  }, []);

  const addMachine = (machine: MachineProps) => {
    fetch(`${urlMachineAdd}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machine),
    })
      .then((response) => response.json())
      .then(() => {
        setMachines((prevMachines) => [...prevMachines, machine]);
      });
  };

  const handleAddNode = () => {
    const newNode: MachineProps = {
      name: `${newMachine} ${newChain}`,
      ip: newIp,
      onClick: () => handleMachineClick(newNode),
      filter: () => [],
    };
    addMachine(newNode);
    setNewMachine("");
    setNewChain("");
    setNewIp("");
  };

  const [selectedChainFilter, setSelectedChainFilter] = useState<string | null>(
    null
  );
  const [selectedMachineFilter, setSelectedMachineFilter] = useState<
    string | null
  >(null);

  const machineNames = Array.from(
    new Set(machines.map((machine) => machine.name.split(" ")[0]))
  );
  const chains = Array.from(
    new Set(machines.map((machine) => machine.name.split(" ")[1]))
  );

  const filteredMachines = machines.filter((machine) => {
    let chainMatch = true;
    let machineMatch = true;

    if (selectedChainFilter) {
      chainMatch = machine.name.includes(selectedChainFilter);
    }

    if (selectedMachineFilter) {
      machineMatch = machine.name.startsWith(selectedMachineFilter);
    }

    return chainMatch && machineMatch;
  });

  return (
    <AppContainer>
      <InnerContainer>
        <FilterContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <select
              style={{
                marginRight: "10px",
              }}
              value={selectedChainFilter || ""}
              onChange={(e) => setSelectedChainFilter(e.target.value)}
            >
              <option value="">All Chains</option>
              {chains.map((chain) => (
                <option key={chain} value={chain}>
                  {chain}
                </option>
              ))}
            </select>

            <select
              value={selectedMachineFilter || ""}
              onChange={(e) => setSelectedMachineFilter(e.target.value)}
            >
              <option value="">All Machines</option>
              {machineNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <input
              style={{
                marginRight: "10px",
              }}
              placeholder="Machine"
              value={newMachine}
              onChange={(e) => setNewMachine(e.target.value)}
            />
            <input
              style={{
                marginRight: "10px",
              }}
              placeholder="Chain"
              value={newChain}
              onChange={(e) => setNewChain(e.target.value)}
            />
            <input
              style={{
                marginRight: "10px",
              }}
              placeholder="IP Address"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
            />
            <button onClick={handleAddNode}>Add Node</button>
          </div>
        </FilterContainer>

        <MachinesContainer>
          {filteredMachines.map((machine) => (
            <div>
              <Machine
                key={machine.ip}
                name={machine.name}
                ip={machine.ip}
                onClick={() => handleMachineClick(machine)}
                filter={function (): never[] {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          ))}
        </MachinesContainer>
      </InnerContainer>
      {isModalOpen && (
        <ModalBackground>
          <ModalContent>
            <CloseButtonContainer>
              <button onClick={() => setIsModalOpen(false)}>x</button>
            </CloseButtonContainer>
            <h3>Remove Machine</h3>
            <p>Are you sure you want to remove {selectedMachine?.name}?</p>
            <button onClick={() => handleRemoveNode(selectedMachine!)}>
              Remove
            </button>
          </ModalContent>
        </ModalBackground>
      )}
    </AppContainer>
  );
};

export default NodeMonitor;
