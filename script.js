var speed = 5
// var screenH = 560
// var screenW = 1300
var screenH = window.innerHeight - 100
var screenW = window.innerWidth - 100
document.getElementById('gbox').style.left = '50px'
document.getElementById('gbox').style.top = '50px'
var bulletSpeed = 20
var invaderSpeed = 1
var frame = 1
var pHealth = 100
var homeHealth = 100
var targetHomeHealth = 100
var twoDigit = true
var oneDigit = true
var killCount = 0
var createBoss = true
var pause = false
var spiralPower = false
var score = 0
var createPowerup = true


var c = document.getElementById('gbox');
c.width = screenW
c.height = screenH
gboxC = {
    x:121,
    y:100
}
space = c.getContext('2d')
var sheet = document.getElementById('sheet');
sheet.width = innerWidth-8
sheet.height = innerHeight-8

velocity = {
    xp:0,
    yp:0,
    xn:0,
    yn:0
}
eV={
    x:0,
    y:0
}
mouse = {
    x:undefined,
    y:undefined
}


window.addEventListener('keypress',(e)=>{
    if (e.key == 'w' || e.key == 'W'){velocity.yn = -speed}
    if (e.key == 'a' || e.key == 'A'){velocity.xn = -speed}
    if (e.key == 'd' || e.key == 'D'){velocity.xp = speed}
    if (e.key == 's' || e.key == 'S'){velocity.yp = speed}
})
window.addEventListener('keyup',(e)=>{
    if (e.key == 'w' || e.key == 'W'){ velocity.yn = 0 }
    if (e.key == 'a' || e.key == 'A'){ velocity.xn = 0 }
    if (e.key == 'd' || e.key == 'D'){ velocity.xp = 0 }
    if (e.key == 's' || e.key == 'S'){ velocity.yp = 0 }
})
window.addEventListener('mousemove',(e)=>{
    mouse.x = e.x - gboxC.x
    mouse.y = e.y - gboxC.y
})
window.addEventListener('mousedown',(e)=>{
    if (getDistance(p1.x + 55*Math.sin((Math.PI / 180) *(90-p1.angle)),h1.x + (h1.width)/2,p1.y + 55*Math.cos((Math.PI / 180) *(90-p1.angle)),h1.y + (h1.height)/2) <= 90){
        bulletsArr.push(new Bullet(p1.x + 55*Math.sin((Math.PI / 180) *(90-p1.angle)),p1.y + 55*Math.cos((Math.PI / 180) *(90-p1.angle)),p1.angle,false
        ))
    }
    else{
        bulletsArr.push(new Bullet(p1.x + 55*Math.sin((Math.PI / 180) *(90-p1.angle)),p1.y + 55*Math.cos((Math.PI / 180) *(90-p1.angle)),p1.angle,true))
    }
})
window.addEventListener('keydown',(e)=>{
    if (e.key=='Escape'){
        pausee()
    }
})

function getDistance(x1,x2,y1,y2){
    let dx = x2-x1
    let dy = y2-y1
    return Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))
}

function generateStars(numStars) {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const radius = Math.random() * 2;
        const opacity = Math.random()
        
        const inc = true;
        stars.push({ x, y, radius, opacity, inc});
    }
    return stars;
}



function drawStars(stars) {

    stars.forEach(star => {
        space.beginPath();
        space.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        space.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        space.fill();
        space.closePath();
    });
}

function pausee() {
    if (!pause) {
        document.getElementById("pause_dialog").showModal()
        window.cancelAnimationFrame(fps)
        pause = true
    } 
    else if (pause){
        document.getElementById("pause_dialog").close()
        fps = window.requestAnimationFrame(animate)
        pause = false
    }
}

class player{
    constructor(){
        this.x = screenW/2 - 400
        this.y = screenH-120
        this.radius = 30
        this.angle = 1.5*Math.PI
    }
    draw(){
        space.fillStyle = 'white'
        space.fillRect(this.x-30,this.y+35,60,10)
        space.fillStyle = 'lightgreen'
        space.fillRect(this.x-29,this.y+36,(60*(pHealth/100))-2,8)
        space.save()
        space.translate(this.x,this.y);
        space.rotate( (Math.PI / 180) * this.angle); 
        space.translate(-this.x,-this.y);
        space.fillStyle = 'red'
        space.fillRect(this.x,this.y-10,55,20)
        space.beginPath()
        space.arc(this.x,this.y,this.radius,0,Math.PI*2)
        space.fillStyle = 'blue'
        space.fill()
        space.restore()
    }
    move(){
        eV.x = eV.y = 0
        if (this.x<this.radius){ eV.x = 6;velocity.x = 0}
        if (this.x+this.radius>screenW){eV.x = -6;velocity.x = 0 }
        if (this.y<this.radius){eV.y = 6; velocity.y = 0}
        if (this.y+this.radius>screenH){eV.y = -6; velocity.y = 0}
        this.x += velocity.xp + velocity.xn + eV.x
        this.y += velocity.yp + velocity.yn + eV.y
        this.angle = ((Math.atan((mouse.y-this.y)/(mouse.x-this.x)))/Math.PI * 180)
        if (mouse.x - this.x <= 0){this.angle += 180}
    }
}

class invaderBot{
    constructor(){
        this.x = (Math.random()*(screenW- 40)) + 20
        this.y = 30
        this.radius = 20
        this.angle = (Math.atan((h1.y + h1.height/2 - this.y)/(h1.x + h1.width/2 - this.x))/Math.PI * 180)
    }
    draw(){
        space.save()
        space.translate(this.x,this.y);
        space.rotate( (Math.PI / 180) * (this.angle)); 
        space.translate(-this.x,-this.y);
        space.fillStyle = 'red'
        space.fillRect(this.x,this.y-7,30,14)
        space.beginPath()
        space.arc(this.x,this.y,this.radius,0,Math.PI*2)
        space.fillStyle = 'rgb(255,255,255)'
        space.fill()
        space.restore()
    }
    move(){
        this.y += 0.1
        this.angle = (Math.atan((h1.y + h1.height/2 - this.y)/(h1.x + h1.width/2 - this.x))/Math.PI * 180)
        if (h1.x + h1.width/2 - (this.x) <= 0){this.angle += 180}
    }
}

class invader{
    constructor(){
        const image = new Image()
        image.src = './images/invader1.png'
        image.onload = () => {
            this.image = image
            this.width = image.width*0.05
            this.height = image.height*0.05
            this.x = (Math.random()*(screenW- 40)) + 20
            this.y = 0
            this.angle = (Math.atan((h1.y + h1.height/2 -(this.y + this.height/2))/(h1.x + h1.width/2 -(this.x + this.width/2)))/Math.PI * 180)
            if (h1.x + h1.width/2 - (this.x + this.width/2) <= 0){this.angle += 180}
            this.vX = Math.sin((Math.PI / 180) *(90-this.angle))*invaderSpeed
            this.vY = Math.cos((Math.PI / 180) *(90-this.angle))*invaderSpeed
        }
    }
    draw(){
        if (this.image){
            space.drawImage(this.image,
                this.x,
                this.y,
                this.width,
                this.height
            )
        }
    }
    move(){
        this.x += this.vX
        this.y += this.vY
    }
}

class BossBot{
    constructor(){
        this.radius = 50
        this.angle = 0
        this.x = screenW/2 + 100
        this.y = -100
        this.targetX = screenW/2 + 20
        this.targetY = 90
        this.health = 100
    }
    draw(){
        space.fillStyle = 'white'
        space.fillRect(this.x-45,this.y-66,90,10)
        space.fillStyle = 'red'
        space.fillRect(this.x-44,this.y-65,(90*(this.health/100))-2,8)
        space.save()
        space.translate(this.x,this.y);
        space.rotate( (Math.PI / 180) * this.angle);
        space.translate(-this.x,-this.y);
        space.fillStyle = 'red'
        space.fillRect(this.x,this.y+8,75,30)
        space.fillRect(this.x,this.y-38,75,30)
        space.beginPath()
        space.arc(this.x,this.y,this.radius,0,Math.PI*2)
        space.fillStyle = 'white'
        space.fill()
        space.restore()
    }
    move(){
        if (getDistance(this.x,this.targetX,this.y,this.targetY)>5){
            this.moveAngle = ((Math.atan((this.targetY-this.y)/(this.targetX-this.x)))/Math.PI * 180)
            if (this.targetX - this.x < 0){this.moveAngle += 180}
            this.x += Math.sin((Math.PI / 180) *(90-this.moveAngle))*10
            this.y += Math.cos((Math.PI / 180) *(90-this.moveAngle))*10
        }
        this.angle = ((Math.atan((h1.y + h1.height/2-this.y)/(h1.x + h1.width/2-this.x)))/Math.PI * 180)
        if (h1.x + h1.width/2 - this.x <= 0){this.angle += 180}
    }
}

class Home{
    constructor(){
        const image = new Image()
        image.src = './images/earth (4).png'
        image.onload = () => {
            this.image = image
            this.width = image.width*0.3
            this.height = image.height*0.3
            this.x = screenW/2 - this.width/2
            this.y = screenH - 240
        }
    }   
    draw(){
        if (this.image){
            space.drawImage(this.image,
                this.x,
                this.y,
                this.width,
                this.height
                )
            }
        space.beginPath()
        let topPoint =  this.x-this.height
        var lnr = space.createLinearGradient(651,350,651,545)
        lnr.addColorStop(1-(homeHealth/100),'rgba(255,0,0,0.6)')
        lnr.addColorStop(1,'transparent')
        space.arc(this.x+this.width/2,this.y+this.height/2,84,0,Math.PI*2)
        space.fillStyle = lnr
        space.fill()
        }
}

class spiralShoot{
    constructor(){
        this.x = (Math.random()*(screenW-(2*50))) + 50
        this.y = (Math.random()*210)+50
        this.radius = 10
    }
    draw(){
        space.beginPath()
        space.arc(this.x,this.y,this.radius,0,Math.PI*2)
        space.fillStyle = 'yellow'
        space.fill()
    }
}

class Bullet{
    constructor(x,y,angle,reflect){        
        this.x = x
        this.y = y
        this.angle = angle
        this.radius = 5
        this.reflect = reflect
    }
    draw(){
        space.beginPath()
        space.arc(this.x,this.y,this.radius,0,Math.PI*2)
        space.fillStyle = 'white'
        space.fill()
    }
    move(){
        this.vX = Math.sin((Math.PI / 180) *(90-this.angle))*bulletSpeed
        this.vY = Math.cos((Math.PI / 180) *(90-this.angle))*bulletSpeed
        this.x += this.vX
        this.y += this.vY
    }
}

class BotBullet{
    constructor(x,y,angle,rad){
        this.x = x
        this.y = y
        this.radius = rad
        this.vX = Math.sin((Math.PI / 180) *(90-angle))*10
        this.vY = Math.cos((Math.PI / 180) *(90-angle))*10
    }
    draw(){
        space.beginPath()
        space.arc(this.x,this.y,this.radius,0,Math.PI*2)
        space.fillStyle = 'blue'
        space.fill()
    }
    move(){
        this.x += this.vX
        this.y += this.vY
    }
}

function animate(){
    space.clearRect(0,0,screenW,screenH)
    drawStars(stars)
    h1.draw()  
    space.fillStyle = 'white'
    space.fillText(homeHealth+'%',homeHealthX+h1.x+(h1.width/2)-53,h1.y+(h1.height/2)+15)
    space.font = 'bold 45px sans-serif'
    space.font = 'bold 30px sans-serif'
    space.fillText('Score: '+score,screenW-180,screenH-30)
    space.font = 'bold 45px sans-serif'
    p1.draw()
    p1.move()
    
    if (pHealth<=0 || homeHealth<=0){
        alert("GameOver")
    }

    powerupArr.forEach((p,index)=>{
        p.draw()
        if (getDistance(p1.x,p.x,p1.y,p.y) < p1.radius + p.radius){
            spiralPower = true
            count = 0
            startangle = p1.angle
            powerupArr.splice(index,1)
            createPowerup = true
            
        }
    })

    if (spiralPower == true){
            p1.angle = startangle + count*5
            p1.draw()
            bulletsArr.push(new Bullet(p1.x + 55*Math.sin((Math.PI / 180) *(90-p1.angle)),p1.y + 55*Math.cos((Math.PI / 180) *(90-p1.angle)),p1.angle,true))
            if (count == 150){
                spiralPower = false
            }
            count++
    }
    
    bulletsArr.forEach((b,index)=>{
        if (b.x < 0 || b.y <0 || b.x > screenW || b.y > screenH){
            bulletsArr.splice(index,1)
        }
        if (getDistance(b.x,h1.x + (h1.width)/2,b.y,h1.y + (h1.height)/2) < 95 && b.reflect == true){
            let correctionAngle = ((Math.atan((h1.y + h1.height/2-b.y)/(h1.x + h1.width/2-b.x)))/Math.PI * 180)
            correctionAngle -= b.angle
            b.angle += 180+(2*correctionAngle)
        }
        b.draw();
        b.move()
    })
    
    bulletsBotArr.forEach((b,index)=>{
        if (b.x < 0 || b.y <0 || b.x > screenW || b.y > screenH){
            bulletsBotArr.splice(index,1)
        }
        else if (getDistance(b.x,p1.x,b.y,p1.y) < p1.radius){
            pHealth -= 5
            bulletsBotArr.splice(index,1)
        }
        else if (getDistance(b.x,h1.x + h1.width/2,b.y,h1.y + h1.height/2)< 84){
            targetHomeHealth -= 1
            bulletsBotArr.splice(index,1)
        }  
        b.draw();
        b.move()
    })
    
    invaderArr.forEach((i,index)=>{
        if (getDistance(i.x+i.width/2,h1.x+h1.width/2,i.y + i.height/2,h1.y + h1.height/2)<(h1.width/2 - 20)){
            targetHomeHealth -= 5
            invaderArr.splice(index,1)
        }
        if (getDistance(i.x+i.width/2,p1.x,i.y + i.height/2,p1.y)<(p1.radius+10)){
            pHealth -= 10
            invaderArr.splice(index,1)
        }        
        i.draw()
        i.move()
    })
    
    invaderBotArr.forEach((i,index)=>{
        if (getDistance(i.x,p1.x,i.y,p1.y)<(p1.radius+i.radius)){
            pHealth -= 10
            invaderBotArr.splice(index,1)
        }       
        i.move()    
        i.draw()
    })
    bossBotArr.forEach((i,index)=>{
        i.draw()
        i.move()
        if (i.health <= 0){
            bossBotArr.splice(index,1)
            createBoss = true
        }
    })
    
    for (let i=0;i<invaderArr.length;i++){
        for (let j=0;j<bulletsArr.length;j++){
            let dist = getDistance(invaderArr[i].x + (invaderArr[i].width/2),bulletsArr[j].x,invaderArr[i].y + (invaderArr[i].height/2),bulletsArr[j].y)
            if (dist < (invaderArr[i].width/2) - 10 && bulletsArr[j].x > invaderArr[i].x && bulletsArr[j].y > invaderArr[i].y ){
                invaderArr.splice(i,1)
                bulletsArr.splice(j,1)
                score += 2
                killCount+=1
                break
            }
        }
    }

    for (let i=0;i<bossBotArr.length;i++){
        for (let j=0;j<bulletsArr.length;j++){
            let dist = getDistance(bossBotArr[i].x,bulletsArr[j].x,bossBotArr[i].y,bulletsArr[j].y)
            if (dist < bossBotArr[i].radius + bulletsArr[j].radius){
                bossBotArr[i].health -= 2
                score += 4
                bulletsArr.splice(j,1)
                break
            }
        }
    }
    
    for (let i=0;i<invaderBotArr.length;i++){
        for (let j=0;j<bulletsArr.length;j++){
            let dist = getDistance(invaderBotArr[i].x,bulletsArr[j].x,invaderBotArr[i].y,bulletsArr[j].y)
            if (dist < invaderBotArr[i].radius + bulletsArr[j].radius){
                invaderBotArr.splice(i,1)
                bulletsArr.splice(j,1)
                score += 10
                killCount+=1
                break
            }
        }
    }


    if (frame%10==0) {
        for (let i = 0; i < numStars; i++) {
            // stars[i].radius = Math.random() * 2;
            if (stars[i].inc == true){
                stars[i].opacity += 0.1
            }
            if (stars[i].inc == false){
                stars[i].opacity -= 0.1
            }
            if (stars[i].opacity >= 1){
                stars[i].inc = false;
            }
            if (stars[i].opacity <= 0){
                stars[i].inc = true;
            }
        }
    }
    if (frame%7==0){
        if (homeHealth>targetHomeHealth){
            space.fillStyle = 'red'
            space.font = 'bold 47px sans-serif'
            homeHealth-=1
        }
        if (homeHealth<100 && twoDigit == true){
            homeHealthX += 10
            twoDigit = false
        }
        if (homeHealth<10 && oneDigit == true){
            homeHealthX += 15
            oneDigit = false
        }
    }
    if (frame%150 == 0 && frame>151){
        invaderArr.push(new invader())
    }
    if (killCount%10 ==0 && killCount>1 && createPowerup == true){
        powerupArr.push(new spiralShoot())
        createPowerup = false
    }
    if (frame%1200   == 0){
        invaderBotArr.push(new invaderBot())
    }
    if (frame%150 == 0){
        let bot = invaderBotArr[Math.floor(Math.random()*invaderBotArr.length)]
        if (bot != null){
            bulletsBotArr.push(new BotBullet(bot.x + 30*Math.sin((Math.PI / 180) *(90-bot.angle)),bot.y + 30*Math.cos((Math.PI / 180) *(90-bot.angle)),bot.angle,3))
        }
    }
    if (frame%120 == 0){
        let bot = bossBotArr[Math.floor(Math.random()*bossBotArr.length)]
        if (bot != null){
            bulletsBotArr.push(new BotBullet(bot.x + 75*Math.sin((Math.PI / 180) *(90-bot.angle))+ 23*Math.sin((Math.PI / 180) *bot.angle),bot.y + 75*Math.cos((Math.PI / 180) *(90-bot.angle)) - 23*Math.cos((Math.PI / 180) *bot.angle),bot.angle,5))
            bulletsBotArr.push(new BotBullet(bot.x + 75*Math.sin((Math.PI / 180) *(90-bot.angle))- 23*Math.sin((Math.PI / 180) *bot.angle),bot.y + 75*Math.cos((Math.PI / 180) *(90-bot.angle)) + 23*Math.cos((Math.PI / 180) *bot.angle),bot.angle,5))
        }
    }
    if (killCount%25 == 0 && createBoss == true && killCount>0){
        bossBotArr.push(new BossBot())
        createBoss = false
    }
    if (frame%350 == 0){
        bossBotArr.forEach((i,index)=>{
            i.targetX = (Math.random()*(screenW-(2*i.radius))) + i.radius
            i.targetY = (Math.random()*210)+50
        })
    }
    invaderSpeed += 0.0000000001*frame
    console.log(invaderSpeed)
    frame += 1
    fps = requestAnimationFrame(animate)
}

p1 = new player()
h1 = new Home()
var powerupArr = []
var invaderArr = []
var bossBotArr = []
var invaderBotArr = []
var bulletsArr = []
var bulletsBotArr = []
var numStars = 500;
var stars = generateStars(numStars);
var homeHealthX = 0;
animate()
