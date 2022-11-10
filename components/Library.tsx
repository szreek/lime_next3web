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
  const [allHtmlBooks, setAllHtmlBooks] = useState<JSX.Element[]>([]);
  const [allBooks, setAllBooks] = useState<[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [bookTittle, setBookTittle] = useState<string | undefined>();
  const [bookCopies, setBookCopies] = useState<number | undefined>();
  

  type Book = {
    id: number;
    copiesCount: number;
    tittle: string;
  };

  useEffect(() => {
    getAvailableBooks()
  },[])


  const getAvailableBooks = async () => {
    try {
      
      const books = await libraryContract.getListOfBooks();
      setAllBooks(books);
      booksToHtml(books);
    } catch(e) {
      setErrorMessage("ERROR: "+ e);
    }
  }


  const booksToHtml = (_books) => {
    const htmlBooks = _books.map( x => 
      <li>
        x.tittle
    </li>);
    setAllHtmlBooks(htmlBooks)
  }


  const addBook  =  async () => {
    setIsLoading(true);
    try {
      const tx = await libraryContract.addBook(bookTittle, bookCopies);
      setTransactionHash(tx.hash);
      await tx.wait();
    } catch(e) {
      setErrorMessage("ERROR: "+ e);
    }
    setIsLoading(false);
    getAvailableBooks()
  }

  const borrowBook  =  async () => {
  }


  const tittleInput = (input) => {
    setBookTittle(input.target.value)
  }

  const copiesInput = (input) => {
    setBookCopies(input.target.value)
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
    <div>
      <h2>Available books:</h2>
      {allHtmlBooks}
    </div>
    <div className="button-wrapper">
      <button onClick={borrowBook}>Submit Results</button>
    </div>
    <form>
      <h2>Add new book:</h2>
      <label>
        Book tittle:
        <input onChange={tittleInput} value={bookTittle} type="text" name="bookTittle" />
      </label>
      <label>
        Copies:
        <input onChange={copiesInput} value={bookCopies} type="number" name="copies" />
      </label>
      {/* <input type="submit" value="Submit" /> */}
    </form>
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
