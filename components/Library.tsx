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
  const [allBooks, setAllBooks] = useState<Book[]>([]);
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
      
      let books: Array<Book> = await libraryContract.getListOfBooks();
      setAllBooks(books);
      booksToHtml(books);
    } catch(e) {
      setErrorMessage("ERROR: "+ e);
    }
  }


  const booksToHtml = (_books) => {
    const htmlBooks = _books.map( x => 
      <li>
        {x.tittle}
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
    getAvailableBooks();
    resetForm();
  }

  const borrowBook  =  async () => {
    setIsLoading(true);
    try {
      const tx = await libraryContract.borrowBook(bookTittle);
      setTransactionHash(tx.hash);
      await tx.wait();
    } catch(e) {
      setErrorMessage("ERROR: "+ e);
    }
    setIsLoading(false);
    getAvailableBooks();
    resetForm();
  }

  const returnBook  =  async () => {
    setIsLoading(true);
    try {
      const tx = await libraryContract.returnBook(bookTittle);
      setTransactionHash(tx.hash);
      await tx.wait();
    } catch(e) {
      setErrorMessage("ERROR: "+ e);
    }
    setIsLoading(false);
    getAvailableBooks();
    resetForm();
  }

  const tittleInput = (input) => {
    setBookTittle(input.target.value)
  }

  const copiesInput = (input) => {
    setBookCopies(input.target.value)
  }

  const resetForm = async () => {
    setBookTittle('');
    setBookCopies(0);
  }


  return (
    
    <div className="results-form">
    <form>
      <label>
      </label>
      {/* <input type="submit" value="Submit" /> */}
    </form>
    <div>
      <h2>The collection of Books in The Library:</h2>
      {allHtmlBooks}
    </div>
    <div className="button-wrapper">
      <button onClick={borrowBook}>Submit Results</button>
    </div>
    <form>
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
    <div className="button-wrapper">
      <button onClick={addBook} disabled={isLoading}>Add Book</button>
      <button onClick={borrowBook} disabled={isLoading}>Borrow Book</button>
      <button onClick={returnBook} disabled={isLoading}>Return Book</button>
    </div>
    <div>
      {isLoading ? <LoadingSpinner /> : resetForm}
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
