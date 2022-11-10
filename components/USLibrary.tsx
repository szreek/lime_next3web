import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useUSElectionContract from "../hooks/useUSElectionContract";
import LoadingSpinner from "./Spinner"

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
  const [votesBiden, setVotesBiden] = useState<number | undefined >();
  const [votesTrump, setVotesTrump] = useState<number | undefined >();
  const [stateSeats, setStateSeats] = useState<number | undefined >();
  const [bidenSeats, setBidenSeats] = useState<number | 0 >();
  const [trumpSeats, setTrumpSeats] = useState<number | 0 >();
  const [electionState, setElectionState] = useState<string>('Active');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');

  useEffect(() => {
    getElectionStatus();
    getCurrentSeats();

    usElectionContract.on('LogElectionEnded', (winner) => {
      setElectionState('Inactive');
    });
  
    usElectionContract.on('LogStateResult', (winner, stateSeats, state) => {
      console.log("In" + bidenSeats + " " + trumpSeats)
      if (winner == Leader.BIDEN) {
        console.log(bidenSeats + stateSeats)
        setBidenSeats(bidenSeats + stateSeats)
      } else if (winner == Leader.TRUMP) {
        setTrumpSeats(trumpSeats + stateSeats)
      } else {
        console.log("cos")
      }
      console.log("In LogStateResult" + winner + " " + stateSeats + state)
      console.log("In9" + bidenSeats + " " + trumpSeats)
      updateCurrentLeader(bidenSeats, trumpSeats)    
    });

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
    console.log(bidenSeats + " " + trumpSeats)
    setBidenSeats(bidenSeats)
    setTrumpSeats(trumpSeats)
    updateCurrentLeader(bidenSeats, trumpSeats)
    } catch(e) {
      console.log(e)
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

  const submitStateResults = async () => {
    if(electionState === 'Active') {
      const result:any = [name, votesBiden, votesTrump, stateSeats];
      setIsLoading(true);
      const tx = await usElectionContract.submitStateResult(result);
      setTransactionHash(tx.hash)
      await tx.wait();
      setIsLoading(false);
      bideVotesInput
      resetForm();
    }
  }

  const resetForm = async () => {
    setStateName('');
    setVotesBiden(0);
    setVotesTrump(0);
    setStateSeats(0);
  }

  const updateCurrentLeader = (bidenS, trumpS) => {
    console.log(bidenS + " " + trumpS)
    if(bidenS > trumpS) {
      setCurrentLeader(Leader[1]);
    } else if(trumpS > bidenS) {
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
    <div>
      {isLoading ? <LoadingSpinner  /> : resetForm}
      {isLoading ? <a href={"https://goerli.etherscan.io/tx/" + transactionHash }>{transactionHash}</a> : "" }
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
