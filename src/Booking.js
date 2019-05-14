import React, {useState, useEffect} from 'react'
import moment from 'moment'
import 'moment/locale/pl'

import Modal from './components/Modal'


const Hour = props => {
  return <div
    onClick={!props.isBooked ? props.startBooking : undefined}
    className='rounded-full text-grey-darkest bg-white hover:bg-blue hover:text-white flex items-center hover:text-4xl justify-center cursor-pointer border border-blue-dark'
    style={{ width: '60px', height: '60px', transition: '0.3s', marginBottom: '5px', background: props.isBooked && 'grey' }}>
    <span>{props.hour}</span>
  </div>
}

const Day = props => {
  const bookedHours = props.booked.map(el => el.hour)
  return <div className='flex flex-col items-center' style={{marginBottom: '10px'}}>
    <div className='flex flex-col text-grey-darker items-center' style={{marginBottom: '10px'}}>
      <div style={{ fontSize: '20px' }}>{props.dayName}</div>
      <div>{props.date.format('DD.MM.YY')}</div>
    </div>
    {props.hours.map((el, i) => {
      const isBooked = bookedHours.includes(el)
      return <Hour isBooked={isBooked} startBooking={() => props.startBooking(props.date, el)} key={i} hour={el} />
    })}
  </div>
}

const Book = props => {
  return <div style={{marginBottom: '10px', padding: '30px', width: '300px', height: '300px'}}>
    <div className='text-grey-dark border-b' style={{ fontSize: '24px', marginBottom: '10px' }}>{props.name}</div>
    <div>Termin</div>
    <div style={{ marginBottom: '20px' }}>{props.date.format('LL')} godzina {props.hour}</div>
    <form onSubmit={(e) => {
        e.preventDefault()
        props.book(e, props.date, props.hour)
      }}>
      <div style={{ marginBottom: '10px' }}>
        <label>
          * Imie i nazwisko:
          <input type='text' className='border' value={props.bookName} required onChange={e => props.setBookName(e.target.value)} />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          * E-mail:
          <input type='email' className='border' value={props.bookMail} required onChange={(e) => props.setBookMail(e.target.value)} />
        </label>
      </div>

        <button type='submit' className='bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded'>
          Zarezerwuj
        </button>
        <button type='button' onClick={props.closeModal} className='bg-red hover:bg-blue-dark text-white font-bold py-2 px-4 rounded' style={{ marginLeft: '5px' }}>
          Anuluj
        </button>
    </form>
  </div>
}

const Booking = () => {
  const name = 'Jakub Modzelewski'
  const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  const [bookName, setBookName] = useState('')
  const [bookMail, setBookMail] = useState('')
  const [bookDate, setBookDate] = useState('')
  const [bookHour, setBookHour] = useState('')
  const [currentDay, setCurrentDay] = useState(moment())
  const [daysToDisplay, setDaysToDisplay] = useState([])
  const [startedBooking, setStartedBooking] = useState(false)
  const [booked, setBooked] = useState([{name: 'Jakub Modzelewski', email: 'modzelewski.kuba@gmail.com', date: moment(), hour: '11:00'}, {name: 'Jakub Modzelewski', email: 'modzelewski.kuba@gmail.com', date: moment(), hour: '18:00'}])
  const date = moment()



  const displayNextWeek = () => {
    setCurrentDay(currentDay.clone().add(7, 'd'))
  }

  const displayPreviousWeek = () => {
    setCurrentDay(currentDay.clone().subtract(7, 'd'))
  }

  const startBooking = (date, hour) => {
    setStartedBooking(true)
    setBookDate(date)
    setBookHour(hour)
  }

  const book = (e, date, hour) => {
    let temp = booked
    temp.push({ name: bookName, email: bookMail, date, hour })
    setBooked(temp)
    setStartedBooking(false)
    setBookMail('')
    setBookName('')
  }

  useEffect(() => {
    let tempDays = []
    for (let i = 0; i < 7; i++) {
      tempDays.push(currentDay.clone().add(i, 'd'))
    }
    setDaysToDisplay(tempDays)
  }, [currentDay])

  if (!daysToDisplay[0]) return null
  return <div style={{ position: 'relative', maxWidth: '800px' }}>
    <div className='text-grey-darker' style={{ fontSize: '24px' }}>{name}</div>
    <div
      onClick={() => {
        setCurrentDay(moment())
      }}
      className='rounded-full text-grey-darkest bg-white hover:bg-blue hover:text-white flex items-center justify-center cursor-pointer border border-blue-dark float-right'
      style={{ width: '60px', height: '60px', transition: '0.3s', marginBottom: '5px' }}>
      <span>TODAY</span>
    </div>
    <div className='flex flexHelper justify-between flex-wrap' style={{padding: '30px', margin: '0 30px'}}>
      {daysToDisplay.map((el, i) => {
        const dates = booked.filter(book => book.date.format('LL') === el.format('LL'))
          return <Day key={i} booked={dates} startBooking={startBooking} dayName={el.format('ddd').toUpperCase()} date={el} hours={hours} />
        })
      }
    </div>
    <div className='nextPosition'>
      <i style={{ fontSize: '40px' }} className='fas fa-chevron-right text-grey-darker hover:text-grey cursor-pointer' onClick={displayNextWeek} />
    </div>
    {date < daysToDisplay[0] &&
      <div className='backPosition'>
        <i style={{ fontSize: '40px' }} className='fas fa-chevron-left text-grey-darker hover:text-grey cursor-pointer' onClick={displayPreviousWeek} />
      </div>
    }
    {startedBooking &&
      <Modal close={() => setStartedBooking(false)}>
        <Book closeModal={() => setStartedBooking(false)} name={name} book={book} setBookName={setBookName} setBookMail={setBookMail} bookName={bookName} bookMail={bookMail} date={bookDate} hour={bookHour} />
      </Modal>
    }
  </div>
}

export default Booking
