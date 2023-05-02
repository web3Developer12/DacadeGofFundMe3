import './FourthHero.css'
import  startYourself from '../../assets/start-yourself.png'
import  startCharity from '../../assets/start-charity.png'
import  startFriends from '../../assets/start-friends-family.png'


export default function FourthHero(){
    return <div className="FourthHero">
        <div data-aos="fade-right" data-aos-duration="500">
            <p className='head'>Make your impact</p>
            <p className='sub'>Fundraise <br/>for...</p>
        </div>

        <div className='cardGroup'>
            <div className='card' data-aos="fade-up" data-aos-duration="700">
                <img src={startYourself}/>
                <p className='card-title'>Yourself</p>
            </div>

            <div className='card' data-aos="fade-up" data-aos-duration="900">
                <img src={startCharity}/>
                <p className='card-title'>Charity</p>
            </div>
            <div className='card' data-aos="fade-up" data-aos-duration="1000">
                <img src={startFriends}/>
                <p className='card-title'>Friends & Family</p>
            </div>
        </div>
    </div>   
}