import { Link, Outlet, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Header from '../Header.jsx';
import { fetchEvents, deleteEvent, queryClient } from '../../util/http.js';
import { useNavigate } from 'react-router-dom';

export default function EventDetails() {
  const params = useParams()
  const navigate = useNavigate();
  const {data, isPending, isError, error} = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({signal}) => fetchEvents({signal, id: params.id}),
  });

  const {mutate} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events']
      })
    navigate('/events')
    }
  });

  function handleDelete() {
    mutate({id: params.id})
    
  }

  let content;

  if(isPending) {
    content = <div id="event-details-content" className='center'>
      <p>Fetching Event Data...</p>
    </div>
  }

  if (isError) {
    content = <div id="event-details-content" className='center'>
      <ErrorBlock title="Faiiled to load event" message={error.info?.message}/>
    </div>
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    content = (
      <>
      <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
      
      <div id="event-details-content">
      <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
      <div id="event-details-info">
        <div>
          <p id="event-details-location">{data.location}</p>
          <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate} @ {data.time}</time>
        </div>
        <p id="event-details-description">{data.description}</p>
      </div>
    </div>
    </>
    )
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        
       {content}
      </article>
    </>
  );
}
