(function(){
    var cnv = document.querySelector("canvas")
    var ctx = cnv.getContext("2d")

    // variaveis de controle de jogo
    var START = 1, PLAY = 2, OVER = 3
    var gameState = START

    var gravity = 0.05
    var catX = catY = hyp = 0

    var score = 0

    // Variavel para armazenar o record no local storage do navegador

    var record = localStorage.getItem("record") ? localStorage.getItem("record") : 0

    // Forma mais extensa de resgatar valor
    // var record = 0
    // if(localStorage.getItem("record") !== null) {
    //     record = localStorage.getItem("record")
    // }

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

    // mensagem inicial
    var startMessage = {
        text: "TOUCH TO START",
        y: (cnv.height / 2 - 100),
        font: "bold 30px Sans-serif",
        color: "#f00",
        visible: true
    }

    messages.push(startMessage)

    // placar final
    var scoreText = Object.create(startMessage)
    scoreText.visible = false
    scoreText.y = (cnv.height / 2 + 50)

    messages.push(scoreText)

    // record
    var recordMessage = Object.create(startMessage)
    recordMessage.visible = false
    recordMessage.y = (cnv.height / 2 + 100)

    messages.push(recordMessage)


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
                if(hyp < ball.radius && !ball.touched) {
                    ball.vx = Math.floor(Math.random() * 21) - 10
                    ball.vy = -(Math.floor(Math.random() * 6) + 5)
                    ball.touched = true
                    score++
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

            scoreText.text = "YOUR SCORE: " + score
            scoreText.visible = true

            if(score > record) {
                record = score
                localStorage.setItem("record", record)
            }

            recordMessage.text = "BEST SCORE: " + record
            recordMessage.visible = true
        }
    }

    function render() {
        ctx.clearRect(0,0, cnv.width, cnv.height)

        // Criado por
        ctx.font = "15px MT"
        ctx.fillStyle = "#000"
        ctx.fillText("By RenanS", 20, 585)

        // renderização da bola na tela
        if(ball.visible) {
            ctx.fillStyle = ball.color
            ctx.beginPath()
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false)
            ctx.closePath()
            ctx.fill()

            // score do jogo
            ctx.font = "bold 15px Arial"
            ctx.fillStyle = "#000"
            ctx.fillText("SCORE: " + score, 10, 20)
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
        score = 0
        scoreText.visible = false
        recordMessage.visible = false
    }

    loop()
}())