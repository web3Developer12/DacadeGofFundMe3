import './Search.css'
import search from '/src/assets/search.svg'
import filter from '/src/assets/filter.png'
import poster from '/src/assets/gh.png'
import { useNavigate } from 'react-router-dom'
import {ethers} from 'ethers';
import ABI from '../artifacts/contracts/GoFundMe.sol/GoFundMe.json'
import { useEffect } from 'react'
import { useState } from 'react'
import { Oval } from 'react-loader-spinner'
import Skeleton from 'react-loading-skeleton'
import { useSpring, animated } from '@react-spring/web'

export default function Search(){

    const navigate       = useNavigate()
    const [dataLoading,setDataLoading] = useState(true)
    const [data,setData] = useState([])
    
    const fetchCampaign  = async()=>{
            const provider = await new ethers.providers.JsonRpcProvider(
                "https://alfajores-forno.celo-testnet.org"
            );
            const contract = new ethers.Contract(
                '0x27Cfc2C4994AfB5A0AB14d4773B694076e55bbAB',ABI.abi,provider
            )
            let   data     = []
            let   cleaned  = []
            const keys     = await contract.getKeys()
            
            for(let key of keys){
                let campaignRequest = await contract.fetchData(key)
                data.push(campaignRequest)
            }

            for(let campaign of data){
                
                const model = {
                    beneficiary:campaign.beneficiary,
                    startDate  :campaign.startDate.toString(),
                    endDate    :campaign.endDate,
                    goal       :Number(campaign.goal),
                    category   :campaign.category,
                    title      :campaign.title,
                    description:campaign.description,
                    storageCid :campaign.web3storage,
                    path       :campaign.web3storagePath,
                    donation   :Number(campaign.fundsRegister),
                    funds      :campaign.funds
                }
                console.log(model.donation)
                cleaned.push(model)
            }
            
            setData(cleaned)
            setDataLoading(false)
        
    }
    const launchCampaign = async()=>{
        const {ethereum}= window;
        if(ethereum){
            const provider = await new ethers.providers.Web3Provider(ethereum)
            const signer   = provider.getSigner()
            const contract = new ethers.Contract(
                '0xD3aE0CA870DEd5424629e369014A417218c4679d',ABI.abi,signer
            )
            const inject   = await contract.launch(
                1,"Technology","Help the Avalanche Network Nodes INBOX","**UPDATE : This fundraiser was initially established to support a toy drive for Damar’s community, sponsored by the Chasing M’s Foundation. However, it has received renewed support in light of Damar’s current battle and we can’t thank all of you enough. Your generosity and compassion mean the world to us.","ipfs url"
            )
            await inject.wait()
            console.log(inject)
        }
    } 

    const loaderSpring = useSpring({
        from  : { opacity: 0 },
        to    : { opacity: 1 },
    })

    const getTotalRaised = (fundsArray)=>{
        let sum=0;
       for(let item of fundsArray){
           const amount = item.amount
            sum+=parseInt(amount._hex, 16)/(10**18)
       }
       return sum;
    }
    
    
    useEffect(()=>{
        fetchCampaign()
    },[])

    return <div className="Search">

        <div className='SearchBarArea'>
            <div className='SearchBar'>
                <img src={search} width={16}/>
                <div className='search-body'>
                    <input type="text" placeholder="Search Fundraisers"/>
                    <div className='filter'>
                        <p onClick={()=>{
                            launchCampaign()
                        }}>Filter</p>
                        <img src={filter} width={17}/>
                    </div>
                </div>
            </div>
        </div>

        <div className='searchResults' >
            {
                dataLoading && <div className='loadingData'>
                    <div >
                        <Oval
                            height="70"
                            width="70"
                            color="#4fa94d"
                            secondaryColor= '#4fa94d'
                            radius='17.5'
                            ariaLabel="mutating-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            strokeWidth={.7}
                        />
                    </div>
                </div>
            }
            {   dataLoading == false &&
                [...data].map((el,index)=>{
                    const icon = `https://${el.storageCid}.ipfs.w3s.link/${el.path}`;
                    return <div onClick={()=>{
                        navigate('/details',{state:el})
                    }} 
                    className='data-campaigns fadeInUp' style={{animationDelay:`${(index)*0.2}s`}} key={index}>

                        <div className='icon' style={{background:`url(${icon})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
                        
                        <div className='info-campain'>

                            <p className='tlt'>{el.title}</p>
                            <p className='by'>by {el.beneficiary.substring(0,4)+"..."+el.beneficiary.slice(-4)}</p>

                            <div className='loader'>
                                <div className='loader-value' style={{
                                    width:`${parseInt(getTotalRaised(el.funds) * 100 /(el.goal))}%`
                                }}>1</div>
                            </div>

                            <p style={{fontFamily:'NunitoRegular'}}><span className='bold'>{getTotalRaised(el.funds)} Celo </span>raised</p>
                        
                        </div>

                        
                    </div>
                })
            }
            
        </div>
    </div>
}

/**
 

 {   dataLoading == false &&
                data.map((el,index)=>{
                    return <div  className='campaignBody fadeInUp' style={{animationDelay:`${(index)*0.2}s`}} key={index} onClick={()=>{
                        navigate('/details',{state:el})
                    }}>
                
                    <div className='campaignImage'>
                        <img src={`https://${el.storageCid}.ipfs.w3s.link/${el.path}`} />
                    </div>
                    <div className='campaignDetails'>
                        
                        <div>
                            <p className='tlt'>{el.title}</p>
                            <p className='by'>by {el.beneficiary.substring(0,4)+"..."+el.beneficiary.slice(-4)}</p>
                        </div>
    
                        <div className='bottom'>
                            <div className='loader'>
                                <div className='loader-value' style={{
                                    width:`${parseInt(getTotalRaised(el.funds) * 100 /(el.goal))}%`
                                }}>1</div>
                            </div>
                            <p><span className='bold'>{getTotalRaised(el.funds)} Avax </span>raised</p>
                        </div>
                    </div>
                </div>
                })
            }

 */