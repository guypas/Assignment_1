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
        const firstPage = res.data.notes || [];
        const totalNotesCount = res.data.totalNotesCount || 0;
       
        return {
          props: {
            firstPage,
            totalNotesCount,
          },
        }
    } catch (error) {
        console.error('Error fetching notes:', error);

        return {
            props: {
              firstPage:[],
              totalNotesCount:0,
            },
          }
    }
  }


export default function Index({ firstPage, totalNotesCount }) {
  return (
    <Myapp firstPage={firstPage} totalNotesCount={totalNotesCount}/>
  );
}
