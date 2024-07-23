import Myapp from "../components/myapp";
import axios from 'axios';

export async function getStaticProps() {
    try{
        const res = await axios.get('http://localhost:3001/notes', {
            params: {
                _page: 1,
                _limit: 10
            },
        });
        const firstPage = res.data.notes;
       
        return {
          props: {
            firstPage,
          },
        }
    } catch (error) {
        console.error('Error fetching notes:', error);

        return {
            props: {
              firstPage:[],
            },
          }
    }
  }


export default function Index({ firstPage }) {
  return (
    <Myapp firstPage={firstPage}/>
  );
}
