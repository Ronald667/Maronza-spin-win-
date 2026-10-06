import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function App(){
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string|null>(null)
  const [rotation, setRotation] = useState(0)
  const [phone, setPhone] = useState('')
  const [spinsLeft, setSpinsLeft] = useState(1)
  const [watchedAd, setWatchedAd] = useState(false)
  const [adLoading, setAdLoading] = useState(false)

  const prizes = ["R5 Airtime","R10 Airtime","R2 Airtime","Try Again","R5 Airtime","R20 JACKPOT","R1 Airtime","Try Again"]

  // Daily spin limit management
  useEffect(() => {
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('maronza_date')
    const savedSpins = localStorage.getItem('maronza_spins_left')
    const savedAd = localStorage.getItem('maronza_watched_ad')

    if (savedDate !== today) {
      localStorage.setItem('maronza_date', today)
      localStorage.setItem('maronza_spins_left', '1')
      localStorage.setItem('maronza_watched_ad', 'false')
      setSpinsLeft(1)
      setWatchedAd(false)
    } else {
      if (savedSpins !== null) setSpinsLeft(parseInt(savedSpins, 10))
      if (savedAd !== null) setWatchedAd(savedAd === 'true')
    }
  }, [])

  const updateSpinsStorage = (newLeft: number, adStatus: boolean) => {
    setSpinsLeft(newLeft)
    setWatchedAd(adStatus)
    localStorage.setItem('maronza_spins_left', String(newLeft))
    localStorage.setItem('maronza_watched_ad', String(adStatus))
  }

  const spin = () => {
    if (spinning) return
    if (spinsLeft <= 0) {
      alert("No spins left! Watch an ad to get an extra spin.")
      return
    }

    setSpinning(true)
    setResult(null)
    const newRot = rotation + Math.random() * 360 + 1440
    setRotation(newRot)

    setTimeout(() => {
      const prize = prizes[Math.floor(Math.random() * prizes.length)]
      setResult(prize)
      setSpinning(false)

      const remaining = spinsLeft - 1
      updateSpinsStorage(remaining, watchedAd)

      if (prize.includes("R5") || prize.includes("R10") || prize.includes("R20") || prize.includes("R1") || prize.includes("R2")) {
        confetti({ particleCount: 150, spread: 90 })
      }
    }, 3000)
  }

  const watchAdForSpin = () => {
    setAdLoading(true)
    setTimeout(() => {
      setAdLoading(false)
      updateSpinsStorage(1, true)
      alert("📺 Ad watched successfully! You got 1 extra spin!")
    }, 3000)
  }

  const claim = () => {
    if (!phone || phone.trim() === '') {
      alert("Phone number cannot be empty!")
      return
    }
    if (phone.length < 10) {
      alert("Enter valid SA number")
      return
    }
    alert(`Claimed! Cynthia will send airtime to ${phone} within 1 hour!`)
    window.open(`https://wa.me/27700000000?text=New+winner:+${phone}`)
  }

  return(
    <div style={{minHeight:'100vh',background:'#0f0f0f',color:'white',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,textAlign:'center'}}>
      <h1 style={{fontSize:32,fontWeight:900,color:'#facc15'}}>MARONZA SPIN & WIN</h1>
      <p>Win R5 Airtime Instantly!</p>
      
      <div style={{margin:15,fontSize:14,background:'#222',padding:'8px 16px',borderRadius:20}}>
        Spins left today: <span style={{color:'#facc15',fontWeight:'bold'}}>{spinsLeft}</span>
      </div>

      <div style={{margin:20,width:280,height:280,borderRadius:'50%',border:'8px solid #facc15',background:'conic-gradient(#facc15 0 45deg,#fff 45deg 90deg,#facc15 90deg 135deg,#22c55e 135deg 180deg,#facc15 180deg 225deg,#ef4444 225deg 270deg,#facc15 270deg 315deg,#fff 315deg 360deg)',transform:`rotate(${rotation}deg)`,transition:spinning?'transform 3s cubic-bezier(0.2,0.8,0.2,1)':'none',display:'flex',alignItems:'center',justifyContent:'center'}}>🎯</div>
      
      {spinsLeft > 0 ? (
        <button onClick={spin} disabled={spinning} style={{background:spinning?'#555':'#facc15',color:'black',fontWeight:900,padding:'16px 40px',borderRadius:30,fontSize:20,border:'none',cursor:'pointer'}}>
          {spinning?'SPINNING...':'SPIN NOW'}
        </button>
      ) : !watchedAd ? (
        <button onClick={watchAdForSpin} disabled={adLoading} style={{background:'#3b82f6',color:'white',fontWeight:900,padding:'16px 30px',borderRadius:30,fontSize:18,border:'none',cursor:'pointer'}}>
          {adLoading ? '📺 Playing Ad (3s)...' : '📺 Watch Ad for Extra Spin'}
        </button>
      ) : (
        <p style={{color:'#ef4444',fontWeight:'bold'}}>Come back tomorrow for more free spins!</p>
      )}

      {result && <div style={{marginTop:20,fontSize:28,fontWeight:800}}>{result.includes("Try")?`😅 ${result}`:`🎉 YOU WON ${result}!`}</div>}
      
      {result && !result.includes("Try") && (
        <div style={{marginTop:15}}>
          <input 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="Enter phone for airtime (e.g. 0731234567)" 
            style={{padding:12,borderRadius:10,border:'none',width:260,textAlign:'center',background:'#222',color:'white'}}
          />
          <br/><br/>
          <button onClick={claim} style={{background:'#22c55e',color:'white',padding:'10px 30px',borderRadius:20,border:'none',fontWeight:'bold',cursor:'pointer'}}>
            CLAIM
          </button>
        </div>
      )}
    </div>
  )
}
