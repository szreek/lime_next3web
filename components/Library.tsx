import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useULibraryContract from "../hooks/useLibraryContract";
import LoadingSpinner from "./Spinner"

type USContract = {
  contractAddress: string;
};


const Library = ({ contractAddress }: USContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const libraryContract = useULibraryContract(contractAddress);

  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');

  useEffect(() => {
  
  },[])

  const borrowBook  =  async () => {

  }

  return (
    
    <div className="results-form">
    <p>
      The collection of Library 'name': 
    </p>
    <form>
      <label>
      </label>
      {/* <input type="submit" value="Submit" /> */}
    </form>
    <div className="button-wrapper">
      <button onClick={borrowBook}>Submit Results</button>
    </div>
    <div>
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

export default Library;
