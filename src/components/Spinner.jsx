import { ClipLoader } from 'react-spinners';
export default function Spinner(){
  return(
    <>
        <ClipLoader
            color='blue'
            size={80}  
        >
        </ClipLoader>
    </>
  )
}