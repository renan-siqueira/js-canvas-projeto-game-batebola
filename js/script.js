(function(){
    var cnv = document.querySelector("canvas")
    var ctx = cnv.getContext("2d")

    // variaveis de controle de jogo
    var START = 1, PLAY = 2, OVER = 3
    var gameState = START

    var gravity = 0.1
    var catX = catY = hyp = 0

    // bola do jogo
    var ball = {
        radius: 20,
        vx: 0,
        vy: 0,
        x: cnv.width / 2 - 10,
        y: 50,
        color: "#00f",
        touched: false,
        visible: false
    }


    // mensagens do jogo
    var messages = []

    var startMessage = {
        text: "TOUCH TO START",
        y: cnv.height / 2 - 100,
        font: "bold 30px Sans-serif",
        color: "#f00",
        visible: true
    }

    messages.push(startMessage)

    // eventos
    cnv.addEventListener("mousedown", function(e){

        catX = ball.x - e.offsetX
        catY = ball.y - e.offsetY
        hyp = Math.sqrt(catX*catX + catY*catY)

        switch(gameState) {
            case START : 
                gameState = PLAY
                startMessage.visible = false
                startGame()
                break
            case PLAY :
                if(hyp < ball.radius && !touched) {
                    ball.vx = Math.floor(Math.random() * 21) - 10
                    ball.vy = -(Math.floor(Math.random() * 6) + 5)
                }
                break
        }
    })

    cnv.addEventListener("mouseup", function(){
        if(gameState === PLAY) {
            ball.touched = false
        }
    })

    function loop() {
        requestAnimationFrame(loop, cnv)

        // o update só irá acontecer se o jogo estiver em andamento
        if(gameState === PLAY) {
            update()
        }

        render()
    }

    function update() {

        // acao da gravidade e deslocamento
        ball.vy += gravity
        ball.y += ball.vy
        ball.x += ball.vx

        //quicar nas paredes
        if(ball.x + ball.radius > cnv.width || ball.x < ball.radius) {
            if(ball.x < ball.radius) {
                ball.x = ball.radius
            } else {
                ball.x = cnv.width - ball.radius
            }
            ball.vx *= -0.8
        }

        // quicar no teto
        if(ball.y < ball.radius && ball.vy < 0) {
            ball.y = ball.radius
            ball.vy *= -0.8

        }


        // game over
        if(ball.y - ball.radius > cnv.height) {

            gameState = OVER
            ball.visible = false

            window.setTimeout(function(){
                startMessage.visible = true
                gameState = START
            }, 2000)
        }
    }

    function render() {
        ctx.clearRect(0,0, cnv.width, cnv.height)

        // renderização da bola na tela
        if(ball.visible) {
            ctx.fillStyle = ball.color
            ctx.beginPath()
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false)
            ctx.closePath()
            ctx.fill()
        }

        // renderização das mensagens na tela
        for(var i in messages) {
            var msg = messages[i]
            if(msg.visible) {
                ctx.font = msg.font
                ctx.fillStyle = msg.color
                ctx.fillText(msg.text, (cnv.width - ctx.measureText(msg.text).width)/2, msg.y)
            }
        }
    }

    function startGame() {
        ball.vy = 0
        ball.y = 50
        ball.vx = Math.floor(Math.random() * 21) - 10
        ball.x = Math.floor(Math.random() * 241) - 20
        ball.visible = true
    }

    loop()
}())