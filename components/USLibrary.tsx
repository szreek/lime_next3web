import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useUSElectionContract from "../hooks/useUSElectionContract";
import loadingIndicator from "./LoadingIndicator"

type USContract = {
  contractAddress: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP
}

const USLibrary = ({ contractAddress }: USContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const usElectionContract = useUSElectionContract(contractAddress);
  const [currentLeader, setCurrentLeader] = useState<string>('Unknown');
  const [name, setStateName] = useState<string | undefined>();
  const [votesBiden, setVotesBiden] = useState<number | undefined>();
  const [votesTrump, setVotesTrump] = useState<number | undefined>();
  const [stateSeats, setStateSeats] = useState<number | undefined>();
  const [bidenSeats, setBidenSeats] = useState<number | undefined>();
  const [trumpSeats, setTrumpSeats] = useState<number | undefined>();
  const [electionState, setElectionState] = useState<string>('Active');

  useEffect(() => {
    getElectionStatus();
    getCurrentSeats();
  },[])

  const getElectionStatus = async () => {
    try {
      const hasEnded = await usElectionContract.electionEnded();
      setElectionState(hasEnded ? 'Inactive' : 'Active');
    } catch(e) {
      
    }
  }

  const getCurrentSeats = async () => {
    try {
    const bidenSeats = await usElectionContract.seats(1);
    const trumpSeats = await usElectionContract.seats(2);
    bidenSeatsInput(bidenSeats)
    trumpSeatsInput(trumpSeats)
    updateCurrentLeader()
    } catch(e) {
      
    }
  }

  const stateNameInput = (input) => {
    setStateName(input.target.value)
  }

  const bideVotesInput = (input) => {
    setVotesBiden(input.target.value)
  }

  const trumpVotesInput = (input) => {
    setVotesTrump(input.target.value)
  }

  const stateSeatsInput = (input) => {
    setStateSeats(input.target.value)
  }

  const bidenSeatsInput = (input) => {
    setBidenSeats(input.target.value)
  }

  const trumpSeatsInput = (input) => {
    setTrumpSeats(input.target.value)
  }

  const submitStateResults = async () => {
    if(electionState === 'Active') {
      const result:any = [name, votesBiden, votesTrump, stateSeats];
      const tx = await usElectionContract.submitStateResult(result);
      await tx.wait();
      resetForm();
    }
  }

  const resetForm = async () => {
    setStateName('');
    setVotesBiden(0);
    setVotesTrump(0);
    setStateSeats(0);
  }

  usElectionContract.on('LogElectionEnded', (winner) => {
    setElectionState('Inactive');
  });

  usElectionContract.on('LogStateResult', (winner, stateSeats, state) => {
    if (winner == Leader.BIDEN) {
      setBidenSeats(bidenSeats + stateSeats)
    } else if (winner == Leader.TRUMP) {
      setTrumpSeats(trumpSeats + stateSeats)
    } else {
      //exception
    }

    updateCurrentLeader()    
  });

  const updateCurrentLeader = () => {
    if(bidenSeats > trumpSeats) {
      setCurrentLeader(Leader[1]);
    } else if(trumpSeats > bidenSeats) {
      setCurrentLeader(Leader[2]);
    } else {
      setCurrentLeader(Leader[0]);
    }
  }

  return (
    <div className="results-form">
    <p>
      Current Leader is: {currentLeader}
    </p>
    <form>
      <label>
        State:
        <input onChange={stateNameInput} value={name} type="text" name="state" />
      </label>
      <label>
        BIDEN Votes:
        <input onChange={bideVotesInput} value={votesBiden} type="number" name="biden_votes" />
      </label>
      <label>
        TRUMP Votes:
        <input onChange={trumpVotesInput} value={votesTrump} type="number" name="trump_votes" />
      </label>
      <label>
        Seats:
        <input onChange={stateSeatsInput} value={stateSeats} type="number" name="seats" />
      </label>
      {/* <input type="submit" value="Submit" /> */}
    </form>
    <div className="button-wrapper">
      <button onClick={submitStateResults}>Submit Results</button>
    </div>
    <style jsx>{`
        .results-form {
          display: flex;
          flex-direction: column;
        }

        .button-wrapper {
          margin: 20px;
        }
        
      `}</style>
    </div>
  );
};

export default USLibrary;
