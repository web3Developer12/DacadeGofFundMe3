import './FundraisingDetails.css'
import gh from '/src/assets/gh.png'
import userImage from '../../assets/user-regular.svg'
import protection from '/src/assets/shield-halved-solid.svg'
import { useLocation } from 'react-router-dom'
import { BigNumber, ethers } from 'ethers'
import ABI from '../../artifacts/contracts/GoFundMe.sol/GoFundMe.json'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function FundraisingDetails(){

    const {state} = useLocation()
    const [avaxCount,setAvaxCount] = useState(0)
    const [user,setUser]           = useState('')

    const donate = async()=>{

        if(parseFloat(avaxCount) > 0 ){
            const {ethereum}= window;
            if(ethereum){
                const provider = await new ethers.providers.Web3Provider(ethereum)
                const signer   = provider.getSigner()
                
                const contract = new ethers.Contract(
                    '0x27Cfc2C4994AfB5A0AB14d4773B694076e55bbAB',ABI.abi,signer
                )
                await contract.contribute(state.title,{value: ethers.utils.parseEther(avaxCount),})
        
            }
        }else{
            toast.error("Funds must be greater than 0", {
                style: {
                border: '1px solid #eb4d4b',
                padding: '16px',
                color: '#eb4d4b',
                fontFamily:"NunitoRegular"
                },
                iconTheme: {
                primary: '#eb4d4b',
                secondary: 'white',
                },
            });
        }
    }

    const claim = async()=>{

            const {ethereum}= window;
            if(ethereum){
                const provider = await new ethers.providers.Web3Provider(ethereum)
                const signer   = provider.getSigner()
                
                const contract = new ethers.Contract(
                    '0x27Cfc2C4994AfB5A0AB14d4773B694076e55bbAB',ABI.abi,signer
                )
                await contract.claim(state.title)
        
            }
    }
    const getTotalRaised = ()=> {
        let sum=0;
       for(let item of state.funds){
           const amount = item.amount
            sum+=parseInt(amount._hex, 16)/(10**18)
       }
       return sum;
    }
    async function getAuthorizedAccount(){
        try{
            const{ethereum} = window;
            if(ethereum){
                const users     = await ethereum.request({
                    method:"eth_accounts"
                })
                if(users.length > 0){
                    setUser(users[0])
                }
            }
            
        }catch(error){
            console.log(error.message)
        }
    }
    function getButtonState(){

        const beneficiary = parseInt(state.beneficiary,16);
        const userM       = parseInt(user,16)

        if(userM == beneficiary && parseInt(getTotalRaised()) >= state.goal){
            return 'Claim Funds'
        }else if(userM != beneficiary && parseInt(getTotalRaised()) >= state.goal){
            return 'campaign Closed'
        }else{
            return 'Donate Now'
        }
    }

    useEffect(()=>{
        getAuthorizedAccount()
        getTotalRaised()
        
    })

    const ImageC = `https://${state.storageCid}.ipfs.w3s.link/${state.path}`;

    return <div className="FundraisingDetails">
        
        <div className='fundraisingDetailsGrid'>
            <p className='fundraisingBodyTitle'>{state.title}</p>

            <div className='row-fundraising'>

            <div className='fundraisingImage' style={{background:`url(${ImageC})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>

            <div className='raisingBoard'>
                <div className='raising'>
                    <p><span className='countAvax'>{getTotalRaised()}</span> CELO raised of {state.goal} goal</p>
                    <div className='loader'>
                         <div className='loader-value' style={{
                                width:`${parseFloat(getTotalRaised() * 100 /(state.goal))}%`
                        }}>1</div>
                    </div>
                    <p>{state.funds.length} Donations</p>
                    <button className='donate' onClick={()=>{
                        if(getButtonState() == 'Donate Now'){
                            donate()
                        }else if(getButtonState() == 'Claim Funds'){
                            claim()
                        }
    
                    }}>{getButtonState()}</button>
                    <div className='input-donation'>
                        <p><span className='dollar'>$</span><br/>CELO</p>
                        <div className='inputDecimal'>
                            <input type="text" autoFocus value={avaxCount} onChange={(e)=>{
                                setAvaxCount(e.target.value)
                            }}/>
                        </div>
                    </div>
                </div>
                
            </div>
            </div>

            <div className='fundraisingOrganizer'>
                    <div className='avatar'>
                        <img src={userImage} width={13}/>
                    </div>
                    <p>{state.beneficiary.substring(0,6)+"..."+state.beneficiary.slice(-6)} is organizing this fundraiser.</p>
            </div>

            <div className='fundraisingDescription'>
                {state.description}
            </div>

            <div className='fundraisingCreationDate'>
                Created {Date(state.startDate)}
            </div>

        </div>

    </div>
}


/**
 

 <div className='fundraisingDetailsGrid'>
            <p className='fundraisingBodyTitle'>{state.title}</p>

            <div className='row-fundraising'>

            <div className='fundraisingImage' ></div>

            <div className='raisingBoard'>
                <div className='raising'>
                    <p><span className='countAvax'>{getTotalRaised()}</span> AVAX raised of {state.goal} goal</p>
                    <div className='loader'>
                         <div className='loader-value' style={{
                                width:`${parseFloat(getTotalRaised() * 100 /(state.goal))}%`
                        }}>1</div>
                    </div>
                    <p>{state.funds.length} Donations</p>
                    <button className='donate' onClick={()=>{
                        if(getButtonState() == 'Donate Now'){
                            donate()
                        }else{
                            toast.error("The campaign is closed", {
                                style: {
                                    border: '1px solid orange',
                                    padding: '16px',
                                    color: 'orange',
                                    fontFamily:"NunitoRegular"
                                },
                                iconTheme: {
                                    primary: 'orange',
                                    secondary: 'white',
                                },
                            });
                        }
    
                    }}>{getButtonState()}</button>
                    <div className='input-donation'>
                        <p><span className='dollar'>$</span><br/>AVAX</p>
                        <div className='inputDecimal'>
                            <input type="text" autoFocus value={avaxCount} onChange={(e)=>{
                                setAvaxCount(e.target.value)
                            }}/>
                        </div>
                    </div>
                </div>
                
            </div>
            </div>
            <div className='fundraisingOrganizer'>
                    <div className='avatar'>
                        <img src={userImage} width={13}/>
                    </div>
                    <p>{state.beneficiary.substring(0,6)+"..."+state.beneficiary.slice(-6)} is organizing this fundraiser.</p>
            </div>
            <div className='fundraisingDescription'>
                {state.description}
            </div>
            <div className='fundraisingCreationDate'>
                Created {Date(state.startDate)}
            </div>
        </div>
 */