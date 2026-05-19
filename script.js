let yoff = 0.0;
let darkClouds = [];
let inkSpots = [];
let clearingSpots = [];
let appState = "INTRO";

let bgColor = 240;

const ASSET_BASE_URL = 'https://zumrenurozen55.github.io/yeni-bos-sandikk/';

let beyazImg;
let beyazVid;
let gerginVid;
let hayalKirikligiImg;
let yakinBeyazImg;
let isiltiImg;
let closeLightImagesRequested = false;
let handLookImages = [];
let handLookImagesRequested = false;
let handLookDelirdiImg;
let handLookStartedAt = 0;
let handLookFinished = false;
let handLookSecondTextShown = false;
let handLookLightOffAt = null;
let handLookInkSpots = [];

let povParallaxImagesRequested = false;
let povParallaxStartedAt = 0;
let povParallaxComplete = false;
let povParallaxCompleteAt = null;
let povParallaxLookCount = 0;
let povParallaxPromptStage = 0;
let povParallaxSuggestedDir = "right";
let povParallaxActiveLookDir = null;
let povParallaxLastCountedDir = null;
let povParallaxInputReady = false;
let povParallaxTarget = { x: 0, y: 0 };
let povParallaxCurrent = { x: 0, y: 0 };
let povParallaxLayers = [
    {
        key: "arka_plan",
        fileName: "parallax_arkaplan.jpg",
        img: null,
        scaleMultiplier: 1.10,
        yOffset: 0,
        bottomAlign: true,
        maxX: 5,
        maxY: 3
    },
    {
        key: "arka_katman",
        fileName: "parallax_arkakatman.webp",
        img: null,
        scaleMultiplier: 0.78,
        yOffset: 0,
        bottomAlign: false,
        maxX: 20,
        maxY: 12
    },
    {
        key: "orta_katman",
        fileName: "parallax_ortakatman.webp",
        img: null,
        scaleMultiplier: 0.78,
        yOffset: 0,
        bottomAlign: false,
        maxX: 45,
        maxY: 25
    },
    {
        key: "on_katman",
        fileName: "parallax_onkatman.webp",
        img: null,
        scaleMultiplier: 0.62,
        yOffset: 160,
        bottomAlign: false,
        maxX: 80,
        maxY: 45
    }
];

let scratchFogStartedAt = 0;
let scratchFogLayer = null;
let scratchFogEraseLayer = null;
let scratchFogLastGrowAt = 0;
let scratchFogLastRegrowAt = 0;
let scratchFogCompletion = 0;
let scratchFogPeakAlpha = 0;
let scratchFogLastEstimateAt = 0;
let scratchFogComplete = false;
let scratchFogCompleteAt = null;
let scratchFogFade = 1;
let scratchFogSecondTextShown = false;
let scratchFogHasTouched = false;
let scratchFogPointerWasDown = false;
let scratchFogBloomingBlobs = [];
let scratchFogPointerInputReady = false;
let scratchFogPointerActive = false;
let scratchFogPointer = { x: 0, y: 0 };

let kalabalikVid;
let beyazBeklerVid;

let noiseOffX = 0;
let noiseOffY = 1000;

let videoFadeAlpha = 255;
let targetVideoFadeAlpha = 255;

let fogOffset = 0;
let flashAlpha = 0;

let choiceState = null;
let choiceFinalAlpha = 0;
let choiceTextAlpha = 0;
let choiceTextIndex = 0;
let choiceTexts = [];
let choiceTextTimer = 0;

let blackFaceInk = null;
let blackFaceInkStarted = false;

let screenShakeAmount = 0;
let screenShakeUntil = 0;

let lastFaceX = 0;
let lastFaceY = 0;

let chapterStarted = false;
let chapterVideoTimer = null;
let chapterFadeAlpha = 255;
let chapterFadeTarget = 255;
let chapterFadeColor = 182;
let closeLightStartedAt = 0;
const GERGIN_QUESTION_TIME = 14000;
const CHAPTER_BG = 182;
const ENDING_BG = 18;
const CLOSE_LIGHT_BG = 182;

class InkSpot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.currentSize = 0;
        this.growth = 0;
    }

    update() {
        this.growth = lerp(this.growth, 18, 0.02);
        this.currentSize += this.growth;
    }

    display() {
        noStroke();

        let gradient = drawingContext.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.currentSize / 2
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        drawingContext.fillStyle = gradient;
        ellipse(this.x, this.y, this.currentSize, this.currentSize);
    }
}

class ClearingSpot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.currentSize = 0;
        this.growth = 0;
    }

    update() {
        this.growth = lerp(this.growth, 15, 0.015);
        this.currentSize += this.growth;
    }

    display() {
        noStroke();

        let gradient = drawingContext.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.currentSize / 2
        );

        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        drawingContext.fillStyle = gradient;
        ellipse(this.x, this.y, this.currentSize, this.currentSize);
    }
}

class FaceInkSpot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.currentSize = 0;
        this.maxSize = max(width, height) * 2.8;
    }

    update() {
        this.currentSize = lerp(this.currentSize, this.maxSize, 0.035);
    }

    display() {
        noStroke();

        let gradient = drawingContext.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.currentSize / 2
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.25, 'rgba(0, 0, 0, 0.98)');
        gradient.addColorStop(0.65, 'rgba(0, 0, 0, 0.88)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        drawingContext.fillStyle = gradient;
        ellipse(this.x, this.y, this.currentSize, this.currentSize);
    }
}

function preload() {
    beyazImg = loadImage(`${ASSET_BASE_URL}BEYAZ.png`);
    hayalKirikligiImg = loadImage(`${ASSET_BASE_URL}beyaz.hayal.kirikligi.png`);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    loadCloseLightImages();
    loadHandLookImages();
    loadPovParallaxImages();

    for (let i = 0; i < 6; i++) {
        darkClouds.push(createNewCloud());
    }

    beyazVid = createVideo([`${ASSET_BASE_URL}beyaz2.mahcup.mp4`]);
    prepareVideo(beyazVid);

    gerginVid = createVideo([`${ASSET_BASE_URL}beyaz_animasyon11.mp4`]);
    prepareVideo(gerginVid);

    kalabalikVid = createVideo([`${ASSET_BASE_URL}kalabalik.mp4`]);
    prepareVideo(kalabalikVid);

    beyazBeklerVid = createVideo([`${ASSET_BASE_URL}beyaz_bekler.mp4`]);
    prepareVideo(beyazBeklerVid);
}

function prepareVideo(video) {
    video.elt.crossOrigin = "anonymous";
    video.elt.muted = true;
    video.elt.defaultMuted = true;
    video.elt.playsInline = true;
    video.elt.preload = "auto";
    video.attribute('playsinline', '');
    video.attribute('webkit-playsinline', '');
    video.attribute('muted', '');
    video.attribute('preload', 'auto');
    video.hide();
    video.volume(0);
    video.elt.load();
}

function safePlayVideo(video, loop = false) {
    if (!video || !video.elt) return;

    video.elt.muted = true;
    video.elt.defaultMuted = true;
    video.elt.playsInline = true;
    video.elt.loop = loop;

    const playPromise = video.elt.play();

    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
    }
}

function primeVideoForMobile(video) {
    if (!video || !video.elt) return;

    video.elt.muted = true;
    video.elt.defaultMuted = true;
    video.elt.playsInline = true;
    video.elt.currentTime = 0;
    safePlayVideo(video, false);

    setTimeout(() => {
        if (video && video.elt) {
            video.elt.pause();
            video.elt.currentTime = 0;
        }
    }, 80);
}

function loadCloseLightImages() {
    if (closeLightImagesRequested) return;

    closeLightImagesRequested = true;
    yakinBeyazImg = new Image();
    isiltiImg = new Image();
    yakinBeyazImg.src = new URL('beyazyakinisilti_1.png', window.location.href).href;
    isiltiImg.src = new URL('isilti1.png', window.location.href).href;
}

function loadHandLookImages() {
    if (handLookImagesRequested) return;

    handLookImagesRequested = true;
    handLookImages = [
        'beyazelebakar1.png',
        'beyazelebakar2.png',
        'beyazelebakar3.png',
        'beyazelebakar4.png'
    ].map(fileName => {
        const img = new Image();
        img.src = new URL(fileName, window.location.href).href;
        return img;
    });

    handLookDelirdiImg = new Image();
    handLookDelirdiImg.src = new URL('beyaz_delirdi.png', window.location.href).href;
}

function ensureScratchFogLayer() {
    if (!scratchFogLayer || scratchFogLayer.width !== width || scratchFogLayer.height !== height) {
        scratchFogLayer = createGraphics(width, height);
        scratchFogLayer.clear();
    }

    if (!scratchFogEraseLayer || scratchFogEraseLayer.width !== width || scratchFogEraseLayer.height !== height) {
        scratchFogEraseLayer = createGraphics(width, height);
        scratchFogEraseLayer.clear();
    }
}

function setupScratchFogPointerInput() {
    if (scratchFogPointerInputReady) return;

    scratchFogPointerInputReady = true;

    window.addEventListener("pointerdown", handleScratchFogPointerEvent, { passive: false });
    window.addEventListener("pointermove", handleScratchFogPointerEvent, { passive: false });
    window.addEventListener("pointerup", clearScratchFogPointerEvent, { passive: true });
    window.addEventListener("pointercancel", clearScratchFogPointerEvent, { passive: true });
}

function handleScratchFogPointerEvent(event) {
    if (appState !== "CHAPTER1_SCRATCH_FOG") return;

    scratchFogPointerActive = true;
    scratchFogPointer.x = event.clientX;
    scratchFogPointer.y = event.clientY;
    event.preventDefault();
}

function clearScratchFogPointerEvent() {
    scratchFogPointerActive = false;
}

function loadPovParallaxImages() {
    if (povParallaxImagesRequested) return;

    povParallaxImagesRequested = true;

    povParallaxLayers.forEach(layer => {
        layer.img = new Image();
        layer.img.src = new URL(layer.fileName, window.location.href).href;
    });
}

function setupPovParallaxInput() {
    if (povParallaxInputReady) return;

    povParallaxInputReady = true;

    window.addEventListener("deviceorientation", handlePovDeviceOrientation, true);
    window.addEventListener("mousemove", handlePovPointerMove, { passive: true });
    window.addEventListener("touchmove", handlePovTouchMove, { passive: true });
}

function requestPovMotionPermission() {
    setupPovParallaxInput();

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        DeviceOrientationEvent.requestPermission().catch(() => {});
    }
}

function handlePovDeviceOrientation(event) {
    if (appState !== "CHAPTER1_POV_PARALLAX") return;

    const gamma = constrain(event.gamma || 0, -24, 24);
    const beta = constrain((event.beta || 0) - 35, -24, 24);

    povParallaxTarget.x = constrain(gamma / 24, -1, 1);
    povParallaxTarget.y = constrain(beta / 24, -1, 1);
}

function handlePovPointerMove(event) {
    if (appState !== "CHAPTER1_POV_PARALLAX") return;

    updatePovPointerInput(event.clientX, event.clientY);
}

function handlePovTouchMove(event) {
    if (appState !== "CHAPTER1_POV_PARALLAX" || !event.touches.length) return;

    updatePovPointerInput(event.touches[0].clientX, event.touches[0].clientY);
}

function updatePovPointerInput(clientX, clientY) {
    povParallaxTarget.x = constrain((clientX - window.innerWidth / 2) / (window.innerWidth / 2), -1, 1);
    povParallaxTarget.y = constrain((clientY - window.innerHeight / 2) / (window.innerHeight / 2), -1, 1);
}

function createNewCloud() {
    return {
        x: random(width),
        y: random(height),
        vx: random(-0.2, 0.2),
        vy: random(-0.2, 0.2),
        size: random(150, 400),
        alpha: 0,
        targetAlpha: random(20, 50),
        lerpSpeed: random(0.005, 0.01)
    };
}

function draw() {
    if (choiceState === null) {
        drawMainScene();
    } else {
        drawMainScene();
        drawChoiceResult();
    }
}

function drawMainScene() {
    if (
        appState === "CHAPTER1_KALABALIK" ||
        appState === "CHAPTER1_BEYAZ_BEKLER" ||
        appState === "CHAPTER1_READY"
    ) {
        bgColor = CHAPTER_BG;
    } else if (appState === "CHAPTER1_ENDING") {
        bgColor = lerp(bgColor, ENDING_BG, 0.08);
    } else if (appState === "CHAPTER1_CLOSE_LIGHT") {
        bgColor = lerp(bgColor, CLOSE_LIGHT_BG, 0.052);
    } else if (
        appState === "CHAPTER1_LOOK_HAND" ||
        appState === "CHAPTER1_POV_PARALLAX" ||
        appState === "CHAPTER1_SCRATCH_FOG"
    ) {
        bgColor = CHAPTER_BG;
    } else if (appState === "TO_BLACK") {
        bgColor = lerp(bgColor, 0, 0.02);
    } else if (appState === "TO_WHITE" || appState === "STORY_READY") {
        bgColor = lerp(bgColor, 255, 0.02);
    }

    background(bgColor);

    let shakeX = 0;
    let shakeY = 0;

    if (millis() < screenShakeUntil) {
        shakeX = random(-screenShakeAmount, screenShakeAmount);
        shakeY = random(-screenShakeAmount, screenShakeAmount);
        screenShakeAmount = lerp(screenShakeAmount, 0, 0.04);
    }

    push();
    translate(shakeX, shakeY);

    if (appState === "INTRO" || appState === "TO_BLACK") {
        drawIntroAtmosphere();
    }

    if (appState === "TO_BLACK" || appState === "TO_WHITE") {
        for (let spot of inkSpots) {
            spot.update();
            spot.display();
        }
    }

    if (appState === "TO_WHITE") {
        for (let spot of clearingSpots) {
            spot.update();
            spot.display();
        }
    }

    if (
        appState === "STORY_READY" ||
        appState === "STORY_MAHCUP" ||
        appState === "STORY_GERGIN" ||
        appState === "CHOICE_READY" ||
        appState === "NO_REACTION" ||
        appState === "CHAPTER1_KALABALIK" ||
        appState === "CHAPTER1_BEYAZ_BEKLER"
    ) {
        drawStoryAsset();

        if (
            appState !== "CHOICE_READY" &&
            appState !== "CHAPTER1_KALABALIK" &&
            appState !== "CHAPTER1_BEYAZ_BEKLER"
        ) {
            drawWhiteUncannyFog();
            drawUncannyFlash();
        }
    }

    pop();

    if (appState === "CHAPTER1_CLOSE_LIGHT") {
        drawCloseLightScene();
    }

    if (appState === "CHAPTER1_LOOK_HAND") {
        drawHandLookScene();
    }

    if (appState === "CHAPTER1_POV_PARALLAX") {
        drawPovParallaxScene();
    }

    if (appState === "CHAPTER1_SCRATCH_FOG") {
        drawScratchFogScene();
    }

    drawChapterVideoFade();
}

function drawIntroAtmosphere() {
    noStroke();

    for (let c of darkClouds) {
        c.x += c.vx;
        c.y += c.vy;

        if (c.x < 0 || c.x > width) c.vx *= -1;
        if (c.y < 0 || c.y > height) c.vy *= -1;

        c.alpha = lerp(c.alpha, c.targetAlpha, c.lerpSpeed);

        let gradient = drawingContext.createRadialGradient(
            c.x, c.y, 0,
            c.x, c.y, c.size / 2
        );

        gradient.addColorStop(0, `rgba(30, 30, 35, ${c.alpha / 255})`);
        gradient.addColorStop(1, `rgba(30, 30, 35, 0)`);

        drawingContext.fillStyle = gradient;
        ellipse(c.x, c.y, c.size, c.size);
    }

    let globalAlpha = map(noise(frameCount * 0.002), 0, 1, 100, 180);
    let lineWeight = map(noise(frameCount * 0.005), 0, 1, 0.5, 1.5);

    strokeWeight(lineWeight);

    drawWave(height * 0.1, height * 0.4, yoff, globalAlpha);
    drawWave(height * 0.6, height * 0.95, yoff + 100, globalAlpha);

    yoff += 0.001;
}

function drawStoryAsset() {
    let driftX = map(noise(noiseOffX), 0, 1, -6, 6);
    let driftY = map(noise(noiseOffY), 0, 1, -4, 4);

    noiseOffX += 0.005;
    noiseOffY += 0.005;

    imageMode(CENTER);

    let currentAsset;
    let fullScreenVideo = false;

    if (appState === "STORY_READY") {
        currentAsset = beyazImg;
    } else if (appState === "STORY_MAHCUP") {
        currentAsset = beyazVid;
    } else if (appState === "STORY_GERGIN" || appState === "CHOICE_READY") {
        currentAsset = gerginVid;
    } else if (appState === "NO_REACTION") {
        currentAsset = hayalKirikligiImg;
    } else if (appState === "CHAPTER1_KALABALIK") {
        currentAsset = kalabalikVid;
        fullScreenVideo = true;
    } else if (appState === "CHAPTER1_BEYAZ_BEKLER") {
        currentAsset = beyazBeklerVid;
        fullScreenVideo = true;
    }

    if (currentAsset) {
        let assetWidth = currentAsset.width || 1080;
        let assetHeight = currentAsset.height || 1920;

        let scaleFactor = fullScreenVideo ? height / assetHeight : (height * 0.80) / assetHeight;

        let drawW = assetWidth * scaleFactor;
        let drawH = assetHeight * scaleFactor;

        let drawX = width / 2;
        let drawY = fullScreenVideo ? height / 2 : height - (drawH / 2);

        let breathe = map(noise(frameCount * 0.008), 0, 1, 0.995, 1.012);

        let finalDrawX = fullScreenVideo ? drawX : drawX + driftX;
        let finalDrawY = fullScreenVideo ? drawY : drawY + driftY;

        lastFaceX = finalDrawX;
        lastFaceY = finalDrawY - drawH * 0.36;

        push();

        if (!fullScreenVideo) {
            translate(width / 2, height / 2);
            scale(breathe);
            translate(-width / 2, -height / 2);
        }

        image(currentAsset, finalDrawX, finalDrawY, drawW, drawH);

        pop();

        videoFadeAlpha = lerp(videoFadeAlpha, targetVideoFadeAlpha, 0.045);

        if (videoFadeAlpha > 1 && !fullScreenVideo) {
            noStroke();
            fill(255, 255, 255, videoFadeAlpha);
            rect(0, 0, width, height);
        }
    }
}

function drawChapterVideoFade() {
    if (
        appState === "CHAPTER1_KALABALIK" ||
        appState === "CHAPTER1_BEYAZ_BEKLER"
    ) {
        chapterFadeAlpha = lerp(chapterFadeAlpha, chapterFadeTarget, 0.075);

        if (chapterFadeAlpha > 1) {
            noStroke();
            fill(chapterFadeColor, chapterFadeColor, chapterFadeColor, chapterFadeAlpha);
            rect(0, 0, width, height);
        }
    }
}

function drawEndingGrain() {
    push();
    noStroke();

    let breath = map(noise(frameCount * 0.012), 0, 1, 6, 18);

    let glow = drawingContext.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, min(width, height) * 0.36
    );

    glow.addColorStop(0, `rgba(255, 255, 255, ${breath / 420})`);
    glow.addColorStop(0.35, `rgba(255, 255, 255, ${breath / 900})`);
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)');

    drawingContext.fillStyle = glow;
    rect(0, 0, width, height);

    fill(255, 255, 255, breath * 0.16);
    rect(0, 0, width, height);

    for (let i = 0; i < 150; i++) {
        fill(255, 255, 255, random(2, 9));
        rect(random(width), random(height), 1, 1);
    }

    pop();
}

function drawCloseLightScene() {
    loadCloseLightImages();

    if (!yakinBeyazImg || !yakinBeyazImg.complete || !yakinBeyazImg.naturalWidth) return;

    const elapsed = millis() - closeLightStartedAt;
    const zoomEase = constrain(elapsed / 18000, 0, 1);
    const closeFade = constrain(elapsed / 1200, 0, 1);
    const zoomStart = 1.046;
    const zoomEnd = 0.998;
    const zoom = lerp(zoomStart, zoomEnd, easeOutCubic(zoomEase));

    const assetWidth = yakinBeyazImg.naturalWidth || yakinBeyazImg.width || 1080;
    const assetHeight = yakinBeyazImg.naturalHeight || yakinBeyazImg.height || 1920;
    const sourceY = assetHeight * 0.17;
    const sourceH = assetHeight - sourceY;
    const scaleFactor = (height * 1.48) / sourceH;
    const drawW = assetWidth * scaleFactor * zoom;
    const drawH = sourceH * scaleFactor * zoom;
    const drawX = width / 2;
    const drawY = height / 2 - drawH * 0.015;

    push();
    drawingContext.globalAlpha = closeFade;
    drawingContext.drawImage(
        yakinBeyazImg,
        0,
        sourceY,
        assetWidth,
        sourceH,
        drawX - drawW / 2,
        drawY - drawH / 2,
        drawW,
        drawH
    );
    pop();

    if (elapsed < 1000) return;

    const lightElapsed = elapsed - 1000;
    const lightFade = constrain(lightElapsed / 900, 0, 1);
    const handSourceX = assetWidth * 0.5;
    const handSourceY = assetHeight * 0.68;
    const handX = drawX - drawW / 2 + (handSourceX / assetWidth) * drawW;
    const handY = drawY - drawH / 2 + ((handSourceY - sourceY) / sourceH) * drawH;
    drawHandLightAt(handX, handY, min(drawW, drawH), lightFade);
}

function drawHandLookScene() {
    loadHandLookImages();
    loadCloseLightImages();

    const readyImages = handLookImages.filter(img => img && img.complete && img.naturalWidth);
    if (readyImages.length < 4 || !handLookDelirdiImg || !handLookDelirdiImg.complete || !handLookDelirdiImg.naturalWidth) return;

    const elapsed = millis() - handLookStartedAt;
    const holdStart = 5000;
    const transitionDuration = 720;
    const holdEnd = holdStart + transitionDuration;
    const finalHoldEnd = holdEnd + 6000;
    const firstGlitchEnd = finalHoldEnd + 180;
    const firstDelirdiEnd = firstGlitchEnd + 1000;
    const returnEnd = firstDelirdiEnd + 260;
    const secondGlitchEnd = returnEnd + 160;
    const sceneEnd = secondGlitchEnd + 5200;
    const sceneScale = lerp(1.035, 1, easeOutCubic(constrain(elapsed / sceneEnd, 0, 1)));
    const delirdiSlowScale = sceneScale * (1 + 0.035 * constrain((elapsed - returnEnd) / 14000, 0, 1));

    if (!handLookSecondTextShown && elapsed >= holdEnd) {
        handLookSecondTextShown = true;
        handLookLightOffAt = millis();
        showChapterText("Ama ya yeterince iyi de\u011filse?");

        setTimeout(() => {
            hideChapterText();
        }, 3000);
    }

    if (!handLookFinished && elapsed >= sceneEnd) {
        handLookFinished = true;
        startChapterOneNextScene();
        return;
    }

    if (elapsed < holdStart) {
        drawGroundedHandLookImage(handLookImages[0], sceneScale);
        drawHandLookLight(sceneScale, elapsed);
        return;
    }

    if (elapsed < holdEnd) {
        const transitionElapsed = elapsed - holdStart;
        const segmentDuration = transitionDuration / 3;
        const frameIndex = constrain(floor(transitionElapsed / segmentDuration) + 1, 1, 3);

        drawGroundedHandLookImage(handLookImages[frameIndex], sceneScale);
        drawHandLookLight(sceneScale, elapsed);
        return;
    }

    if (elapsed < finalHoldEnd) {
        drawGroundedHandLookImage(handLookImages[3], sceneScale);
        drawHandLookLight(sceneScale, elapsed);
        return;
    }

    if (elapsed < firstGlitchEnd) {
        drawHandLookInkSpots(elapsed, finalHoldEnd, secondGlitchEnd);
        drawGroundedHandLookImage(handLookImages[3], sceneScale);
        drawGlitchBurst(handLookImages[3], handLookDelirdiImg, sceneScale, map(elapsed, finalHoldEnd, firstGlitchEnd, 0.45, 1));
        return;
    }

    if (elapsed < firstDelirdiEnd) {
        drawHandLookInkSpots(elapsed, finalHoldEnd, secondGlitchEnd);
        drawGroundedHandLookImage(handLookDelirdiImg, sceneScale, true);
        drawGlitchNoise(map(elapsed, firstGlitchEnd, firstDelirdiEnd, 0.65, 0.25));
        return;
    }

    if (elapsed < returnEnd) {
        drawHandLookInkSpots(elapsed, finalHoldEnd, secondGlitchEnd);
        drawGroundedHandLookImage(handLookImages[3], sceneScale);
        return;
    }

    if (elapsed < secondGlitchEnd) {
        drawHandLookInkSpots(elapsed, finalHoldEnd, secondGlitchEnd);
        drawGroundedHandLookImage(handLookImages[3], sceneScale);
        drawGlitchBurst(handLookImages[3], handLookDelirdiImg, delirdiSlowScale, map(elapsed, returnEnd, secondGlitchEnd, 0.7, 1.15));
        return;
    }

    const finalDelirdiElapsed = elapsed - secondGlitchEnd;
    drawHandLookInkSpots(elapsed, finalHoldEnd, secondGlitchEnd);
    drawDelirdiDizzyImage(delirdiSlowScale, finalDelirdiElapsed);
    drawGlitchNoise(0.14);
}

function drawPovParallaxScene() {
    loadPovParallaxImages();

    const ready = povParallaxLayers.every(layer => layer.img && layer.img.complete && layer.img.naturalWidth);
    if (!ready) return;

    povParallaxCurrent.x = lerp(povParallaxCurrent.x, povParallaxTarget.x, 0.035);
    povParallaxCurrent.y = lerp(povParallaxCurrent.y, povParallaxTarget.y, 0.035);

    evaluatePovLookTask();

    for (let i = 0; i < povParallaxLayers.length; i++) {
        drawPovParallaxLayer(povParallaxLayers[i], i);
    }

    drawPovSocialPressureVignette();
    drawPovDirectionHint();

    if (povParallaxCompleteAt && millis() - povParallaxCompleteAt > 2100) {
        startScratchFogScene();
    }
}

function drawPovParallaxLayer(layer, index) {
    const img = layer.img;
    const assetWidth = img.naturalWidth || img.width || 1080;
    const assetHeight = img.naturalHeight || img.height || 1920;
    const baseScale = layer.bottomAlign
        ? max(width / assetWidth, height / assetHeight)
        : height / assetHeight;
    const scaleFactor = baseScale * layer.scaleMultiplier;
    const drawW = assetWidth * scaleFactor;
    const drawH = assetHeight * scaleFactor;
    const panic = getPovPanicPulse();
    const driftX = sin(frameCount * (0.006 + index * 0.0017) + index * 1.8) * (0.8 + index * 0.55);
    const driftY = cos(frameCount * (0.0048 + index * 0.0014) + index * 1.2) * (0.55 + index * 0.42);
    const humanSwayX = sin(frameCount * (0.012 + index * 0.003) + index * 2.4) * (index === 0 ? 0.25 : 1.2 + index * 0.55);
    const humanSwayY = cos(frameCount * (0.010 + index * 0.0025) + index * 1.7) * (index === 0 ? 0.15 : 0.55 + index * 0.22);
    const panicTremorX = sin(frameCount * 0.17 + index * 1.9) * panic.tremor * (0.45 + index * 0.22);
    const panicTremorY = cos(frameCount * 0.145 + index * 1.2) * panic.tremor * (0.32 + index * 0.18);
    const lookX = povParallaxCurrent.x * layer.maxX;
    const lookY = povParallaxCurrent.y * layer.maxY;
    const drawX = width / 2 + lookX + driftX + humanSwayX + panicTremorX;
    const baseY = layer.bottomAlign
        ? height - drawH / 2
        : height - drawH / 2 + layer.yOffset;
    const drawY = baseY + lookY + driftY + humanSwayY + panicTremorY;
    const opacityWave = map(sin(frameCount * (0.007 + index * 0.001) + index), -1, 1, 0.96, 1);
    const blurWave = index === 0
        ? panic.blur * 0.32
        : map(sin(frameCount * 0.005 + index), -1, 1, 0.22, 0.86) + panic.blur * (0.72 + index * 0.24);
    const scaleBreath = 1 + sin(frameCount * (0.0075 + index * 0.001) + index) * (index === 0 ? 0.0008 : 0.0022);
    const finalW = drawW * scaleBreath;
    const finalH = drawH * scaleBreath;

    push();
    drawingContext.save();
    drawingContext.globalAlpha = opacityWave;
    drawingContext.filter = `blur(${blurWave}px)`;
    drawingContext.drawImage(img, drawX - finalW / 2, drawY - finalH / 2, finalW, finalH);

    if (index > 0) {
        drawingContext.globalAlpha = panic.ghostAlpha * (0.55 + index * 0.14);
        drawingContext.filter = `blur(${blurWave + 1.2}px)`;
        drawingContext.drawImage(
            img,
            drawX - finalW / 2 + panic.ghostX * (0.35 + index * 0.18),
            drawY - finalH / 2 + panic.ghostY * (0.25 + index * 0.12),
            finalW,
            finalH
        );
    }

    drawingContext.restore();
    pop();
}

function getPovPanicPulse() {
    const slow = map(noise(frameCount * 0.018 + 90), 0, 1, 0, 1);
    const breath = (sin(frameCount * 0.058) + 1) * 0.5;
    const intensity = constrain(0.35 + slow * 0.48 + breath * 0.17, 0, 1);

    return {
        tremor: intensity * 1.35,
        blur: intensity * 1.35,
        ghostAlpha: intensity * 0.048,
        ghostX: sin(frameCount * 0.11) * 5.5,
        ghostY: cos(frameCount * 0.095) * 3.2
    };
}

function drawPovSocialPressureVignette() {
    push();
    noStroke();

    const panic = getPovPanicPulse();
    const breath = map(noise(frameCount * 0.006 + 140), 0, 1, 0.58, 1);
    const sideAlpha = 40 * breath + panic.blur * 5;
    const topAlpha = 22 * breath + panic.blur * 3;

    let leftGradient = drawingContext.createLinearGradient(0, 0, width * 0.32, 0);
    leftGradient.addColorStop(0, `rgba(15, 14, 16, ${sideAlpha / 255})`);
    leftGradient.addColorStop(1, 'rgba(15, 14, 16, 0)');
    drawingContext.fillStyle = leftGradient;
    rect(0, 0, width * 0.34, height);

    let rightGradient = drawingContext.createLinearGradient(width, 0, width * 0.68, 0);
    rightGradient.addColorStop(0, `rgba(15, 14, 16, ${sideAlpha / 255})`);
    rightGradient.addColorStop(1, 'rgba(15, 14, 16, 0)');
    drawingContext.fillStyle = rightGradient;
    rect(width * 0.66, 0, width * 0.34, height);

    let topGradient = drawingContext.createLinearGradient(0, 0, 0, height * 0.28);
    topGradient.addColorStop(0, `rgba(245, 245, 245, ${topAlpha / 255})`);
    topGradient.addColorStop(1, 'rgba(245, 245, 245, 0)');
    drawingContext.fillStyle = topGradient;
    rect(0, 0, width, height * 0.28);

    const focusX = width / 2 + povParallaxCurrent.x * width * 0.035;
    const focusY = height * 0.48 + povParallaxCurrent.y * height * 0.025;
    const pressure = drawingContext.createRadialGradient(
        focusX,
        focusY,
        min(width, height) * 0.08,
        focusX,
        focusY,
        max(width, height) * 0.72
    );

    pressure.addColorStop(0, 'rgba(255, 255, 255, 0)');
    pressure.addColorStop(0.42, `rgba(235, 235, 235, ${(panic.blur * 0.014).toFixed(3)})`);
    pressure.addColorStop(1, `rgba(12, 12, 14, ${(0.08 + panic.blur * 0.018).toFixed(3)})`);
    drawingContext.fillStyle = pressure;
    rect(0, 0, width, height);

    pop();
}

function drawPovDirectionHint() {
    if (povParallaxComplete) return;

    const hint = getPovDirectionHint(povParallaxSuggestedDir);
    const pulse = map(sin(frameCount * 0.045), -1, 1, 0.35, 1);
    const breathe = map(noise(frameCount * 0.012 + 520), 0, 1, -2, 2);

    push();
    textAlign(CENTER, CENTER);
    textFont("Courier New");
    textSize(12);
    textStyle(BOLD);
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.9)';
    drawingContext.shadowBlur = 10;
    fill(12, 12, 12, 70 + pulse * 72);
    text(hint.label, hint.x + hint.dx * pulse, hint.y + hint.dy * pulse + breathe);
    pop();
}

function getPovDirectionHint(direction) {
    const insetX = width * 0.17;
    const insetY = height * 0.17;

    if (direction === "left") {
        return { label: "sola bak", x: insetX, y: height * 0.52, dx: -8, dy: 0 };
    }

    if (direction === "right") {
        return { label: "sa\u011fa bak", x: width - insetX, y: height * 0.52, dx: 8, dy: 0 };
    }

    if (direction === "up") {
        return { label: "yukar\u0131 bak", x: width / 2, y: insetY, dx: 0, dy: -7 };
    }

    return { label: "a\u015fa\u011f\u0131 bak", x: width / 2, y: height - insetY, dx: 0, dy: 7 };
}

function evaluatePovLookTask() {
    if (povParallaxComplete) return;

    const absX = abs(povParallaxCurrent.x);
    const absY = abs(povParallaxCurrent.y);
    const centerThreshold = 0.16;
    const lookThreshold = 0.34;
    let direction = null;

    if (absX < centerThreshold && absY < centerThreshold) {
        povParallaxActiveLookDir = null;
        return;
    }

    if (max(absX, absY) >= lookThreshold) {
        if (absX > absY) {
            direction = povParallaxCurrent.x > 0 ? "right" : "left";
        } else {
            direction = povParallaxCurrent.y > 0 ? "down" : "up";
        }
    }

    if (!direction || direction === povParallaxActiveLookDir) return;

    povParallaxActiveLookDir = direction;

    if (direction === povParallaxLastCountedDir) return;

    povParallaxLastCountedDir = direction;
    povParallaxLookCount++;
    setNextPovSuggestedDirection(direction);

    if (povParallaxLookCount >= 5) {
        completePovParallaxScene();
    } else {
        updatePovTaskPrompt();
    }
}

function setNextPovSuggestedDirection(previousDirection = null) {
    const directionOrder = ["right", "left", "up", "down"];
    const currentIndex = directionOrder.indexOf(povParallaxSuggestedDir);
    let nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % directionOrder.length;

    if (directionOrder[nextIndex] === previousDirection) {
        nextIndex = (nextIndex + 1) % directionOrder.length;
    }

    povParallaxSuggestedDir = directionOrder[nextIndex];
    updatePovPromptPosition();
}

function updatePovPromptPosition() {
    const chapterText = document.getElementById("chapter-text");
    if (!chapterText) return;

    const offsets = {
        left: { x: "-22px", y: "0px" },
        right: { x: "22px", y: "0px" },
        up: { x: "0px", y: "-16px" },
        down: { x: "0px", y: "20px" }
    };
    const offset = offsets[povParallaxSuggestedDir] || { x: "0px", y: "0px" };

    chapterText.style.setProperty("--pov-hint-x", offset.x);
    chapterText.style.setProperty("--pov-hint-y", offset.y);
}

function updatePovTaskPrompt() {
    if (appState !== "CHAPTER1_POV_PARALLAX" || povParallaxComplete) return;

    const directionText = getPovDirectionText(povParallaxSuggestedDir);

    if (povParallaxLookCount === 1 && povParallaxPromptStage < 1) {
        povParallaxPromptStage = 1;
        showChapterText(`Bir tepki ar\u0131yorsun.\nAyn\u0131 bak\u0131\u015fta kalma.\n\u015eimdi ${directionText}.`);
    } else if (povParallaxLookCount === 3 && povParallaxPromptStage < 2) {
        povParallaxPromptStage = 2;
        showChapterText(`Yeterli de\u011fil.\nKalabal\u0131\u011f\u0131n ba\u015fka yerini oku.\n${capitalizePovDirection(directionText)}.`);
    } else if (povParallaxLookCount === 4 && povParallaxPromptStage < 3) {
        povParallaxPromptStage = 3;
        showChapterText(`Son bir iz ara.\n${capitalizePovDirection(directionText)}.`);
    }
}

function getPovDirectionText(direction) {
    if (direction === "left") return "sola bak";
    if (direction === "right") return "sa\u011fa bak";
    if (direction === "up") return "yukar\u0131 bak";
    return "a\u015fa\u011f\u0131 bak";
}

function capitalizePovDirection(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function completePovParallaxScene() {
    if (povParallaxComplete) return;

    povParallaxComplete = true;
    povParallaxCompleteAt = millis();
    povParallaxSuggestedDir = null;
    updatePovPromptPosition();
    hideChapterText();

    setTimeout(() => {
        if (appState === "CHAPTER1_POV_PARALLAX") {
            showChapterText("Bulam\u0131yor.");
        }
    }, 600);
}

function drawScratchFogScene() {
    loadHandLookImages();
    ensureScratchFogLayer();

    if (!handLookDelirdiImg || !handLookDelirdiImg.complete || !handLookDelirdiImg.naturalWidth) return;

    const elapsed = millis() - scratchFogStartedAt;
    const layout = getScratchFogBeyazLayout();
    const jitter = getScratchFogJitter();

    drawScratchFogBackground(elapsed);
    drawScratchFogBeyaz(layout, jitter);
    updateScratchFogGrowth(layout);

    if (!scratchFogComplete) {
        handleScratchFogPointer(layout);
    }

    renderScratchFogLayer();

    if (scratchFogComplete) {
        scratchFogFade = lerp(scratchFogFade, 0, 0.035);
    }

    push();
    drawingContext.globalAlpha = scratchFogFade;
    image(scratchFogLayer, 0, 0);
    pop();

    drawScratchFogPressure(layout);

    if (!scratchFogComplete) {
        if (millis() - scratchFogLastEstimateAt > 520) {
            scratchFogLastEstimateAt = millis();
            scratchFogCompletion = max(scratchFogCompletion, estimateScratchFogCompletion(layout));
        }

        if (scratchFogHasTouched && scratchFogCompletion >= 0.7 && millis() - scratchFogStartedAt > 3500) {
            completeScratchFogScene();
        }
    } else if (scratchFogCompleteAt && millis() - scratchFogCompleteAt > 1900) {
        startAfterScratchFogScene();
    }
}

function getScratchFogBeyazLayout() {
    const assetWidth = handLookDelirdiImg.naturalWidth || handLookDelirdiImg.width || 1080;
    const assetHeight = handLookDelirdiImg.naturalHeight || handLookDelirdiImg.height || 1920;
    const scaleFactor = (height * 0.88) / assetHeight;
    const drawW = assetWidth * scaleFactor;
    const drawH = assetHeight * scaleFactor;
    const drawX = width / 2;
    const drawY = height - drawH / 2 + height * 0.025;

    return {
        assetWidth,
        assetHeight,
        drawW,
        drawH,
        drawX,
        drawY,
        left: drawX - drawW / 2,
        top: drawY - drawH / 2,
        right: drawX + drawW / 2,
        bottom: drawY + drawH / 2
    };
}

function getScratchFogJitter() {
    return {
        x: (noise(frameCount * 0.07 + 12) - 0.5) * 3.2 + sin(frameCount * 0.047) * 0.6,
        y: (noise(frameCount * 0.065 + 80) - 0.5) * 2.6 + cos(frameCount * 0.039) * 0.5
    };
}

function drawScratchFogBackground(elapsed) {
    background(CHAPTER_BG);

    push();
    noStroke();
    const pulse = map(noise(frameCount * 0.006 + 340), 0, 1, 0.18, 0.42);
    const vignette = drawingContext.createRadialGradient(
        width / 2,
        height * 0.54,
        min(width, height) * 0.18,
        width / 2,
        height * 0.54,
        max(width, height) * 0.76
    );

    vignette.addColorStop(0, `rgba(230, 228, 228, ${0.05 + pulse * 0.04})`);
    vignette.addColorStop(0.6, `rgba(155, 150, 150, ${0.05 + pulse * 0.04})`);
    vignette.addColorStop(1, `rgba(20, 18, 20, ${0.16 + pulse * 0.09})`);
    drawingContext.fillStyle = vignette;
    rect(0, 0, width, height);

    if (elapsed < 1300) {
        fill(255, 255, 255, map(elapsed, 0, 1300, 255, 0));
        rect(0, 0, width, height);
    }

    pop();
}

function drawScratchFogBeyaz(layout, jitter) {
    push();
    drawingContext.save();
    drawingContext.filter = `contrast(1.03) saturate(0.92) brightness(0.98)`;
    drawingContext.drawImage(
        handLookDelirdiImg,
        layout.left + jitter.x,
        layout.top + jitter.y,
        layout.drawW,
        layout.drawH
    );
    drawingContext.restore();
    pop();
}

function addScratchFogVeil(layout, strength = 0.24) {
    if (!scratchFogLayer) return;

    const ctx = scratchFogLayer.drawingContext;
    const centerX = layout.drawX;
    const headY = layout.top + layout.drawH * 0.32;
    const bodyY = layout.top + layout.drawH * 0.66;
    const veilW = layout.drawW * 0.72;
    const veilH = layout.drawH * 0.58;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = `blur(${constrain(layout.drawW * 0.025, 5, 12)}px)`;

    const gradient = ctx.createRadialGradient(
        centerX,
        bodyY,
        veilW * 0.08,
        centerX,
        bodyY,
        veilW * 0.56
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${strength})`);
    gradient.addColorStop(0.48, `rgba(235, 235, 235, ${strength * 0.64})`);
    gradient.addColorStop(0.86, `rgba(210, 210, 215, ${strength * 0.18})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(centerX, bodyY, veilW * 0.54, veilH * 0.5, -0.08, 0, TWO_PI);
    ctx.fill();

    const headGradient = ctx.createRadialGradient(
        centerX,
        headY,
        veilW * 0.06,
        centerX,
        headY,
        veilW * 0.42
    );

    headGradient.addColorStop(0, `rgba(255, 255, 255, ${strength * 0.82})`);
    headGradient.addColorStop(0.62, `rgba(232, 232, 232, ${strength * 0.38})`);
    headGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.ellipse(centerX, headY, veilW * 0.42, veilH * 0.26, 0.05, 0, TWO_PI);
    ctx.fill();

    ctx.restore();
}

function updateScratchFogGrowth(layout) {
    if (scratchFogComplete || !scratchFogLayer) return;

    const now = millis();

    if (now - scratchFogLastGrowAt > 820) {
        scratchFogLastGrowAt = now;
        addScratchFogBlobs(layout, 1, false);
    }

    if (scratchFogHasTouched && now - scratchFogLastRegrowAt > random(820, 1180)) {
        scratchFogLastRegrowAt = now;

        if (scratchFogCompletion < 0.62) {
            addScratchFogBlobs(layout, 1, true);
        }
    }
}

function addScratchFogBlobs(layout, count, regrow = false) {
    for (let i = 0; i < count; i++) {
        const spot = getScratchFogSpot(layout);
        if (!spot) continue;

        const baseRadius = min(width, height) * random(regrow ? 0.09 : 0.12, regrow ? 0.13 : 0.18);

        scratchFogBloomingBlobs.push({
            x: spot.x,
            y: spot.y,
            radius: constrain(baseRadius, regrow ? 54 : 72, regrow ? 86 : 128),
            strength: regrow ? random(0.48, 0.62) : random(0.76, 0.94),
            bornAt: millis() + random(0, regrow ? 240 : 420),
            duration: random(regrow ? 900 : 1100, regrow ? 1500 : 1900),
            seed: random(1000)
        });
    }

    if (scratchFogBloomingBlobs.length > 12) {
        scratchFogBloomingBlobs.splice(0, scratchFogBloomingBlobs.length - 12);
    }
}

function renderScratchFogLayer() {
    if (!scratchFogLayer || !scratchFogBloomingBlobs.length) return;

    scratchFogLayer.clear();

    const ctx = scratchFogLayer.drawingContext;
    const now = millis();

    for (let i = scratchFogBloomingBlobs.length - 1; i >= 0; i--) {
        const blob = scratchFogBloomingBlobs[i];
        const progress = constrain((now - blob.bornAt) / blob.duration, 0, 1);

        if (progress <= 0) continue;

        const easedProgress = progress * progress * (3 - 2 * progress);
        const alpha = blob.strength * easedProgress;
        const breathe = 1 + sin(frameCount * 0.018 + blob.seed) * 0.025;
        const creep = 0.72 + progress * 0.42;

        drawScratchFogBlob(ctx,
            blob.x + sin(blob.seed + progress * 2.1) * blob.radius * 0.035,
            blob.y + cos(blob.seed + progress * 1.7) * blob.radius * 0.03,
            blob.radius * breathe * creep,
            alpha
        );
    }

    if (scratchFogEraseLayer) {
        const eraseCanvas = scratchFogEraseLayer.elt || scratchFogEraseLayer.canvas;

        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(eraseCanvas, 0, 0);
        ctx.restore();
    }
}

function getScratchFogSpot(layout) {
    const pad = min(width, height) * 0.045;

    for (let attempt = 0; attempt < 80; attempt++) {
        const x = random(layout.left - pad, layout.right + pad);
        const y = random(layout.top + layout.drawH * 0.08, layout.bottom - layout.drawH * 0.03);

        if (isNearScratchFogSilhouette(x, y, layout, pad)) {
            return { x, y };
        }
    }

    return {
        x: random(layout.left + layout.drawW * 0.26, layout.right - layout.drawW * 0.26),
        y: random(layout.top + layout.drawH * 0.18, layout.bottom - layout.drawH * 0.12)
    };
}

function isNearScratchFogSilhouette(x, y, layout, margin) {
    const nx = (x - layout.left) / layout.drawW;
    const ny = (y - layout.top) / layout.drawH;
    const softMarginX = margin / max(layout.drawW, 1);
    const softMarginY = margin / max(layout.drawH, 1);

    if (nx < -softMarginX || nx > 1 + softMarginX || ny < -softMarginY || ny > 1 + softMarginY) {
        return false;
    }

    const inEllipse = (cx, cy, rx, ry) => {
        const dx = (nx - cx) / (rx + softMarginX);
        const dy = (ny - cy) / (ry + softMarginY);
        return dx * dx + dy * dy <= 1;
    };

    const head = inEllipse(0.5, 0.27, 0.2, 0.18);
    const hair = inEllipse(0.5, 0.32, 0.28, 0.24);
    const torso = inEllipse(0.5, 0.67, 0.25, 0.3);
    const leftArm = inEllipse(0.31, 0.73, 0.095, 0.24);
    const rightArm = inEllipse(0.69, 0.73, 0.095, 0.24);
    const upperBodyBridge = nx > 0.33 - softMarginX && nx < 0.67 + softMarginX && ny > 0.4 - softMarginY && ny < 0.86 + softMarginY;

    return head || hair || torso || leftArm || rightArm || upperBodyBridge;
}

function drawScratchFogBlob(ctx, x, y, radius, strength) {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    const alpha = constrain(strength, 0, 0.92);
    const glowRadius = radius * 1.62;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);

    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.34, `rgba(255, 255, 255, ${alpha * 0.82})`);
    gradient.addColorStop(0.66, `rgba(255, 255, 255, ${alpha * 0.32})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, TWO_PI);
    ctx.fill();

    ctx.restore();
}

function handleScratchFogPointer(layout) {
    const pointerDown = scratchFogPointerActive || touches.length > 0 || mouseIsPressed;

    if (!pointerDown) {
        scratchFogPointerWasDown = false;
        return;
    }

    const pointer = scratchFogPointerActive
        ? scratchFogPointer
        : touches.length > 0
            ? touches[0]
            : { x: mouseX, y: mouseY };

    if (pointer.x < layout.left - 80 || pointer.x > layout.right + 80 || pointer.y < layout.top - 80 || pointer.y > layout.bottom + 80) {
        scratchFogPointerWasDown = pointerDown;
        return;
    }

    if (!scratchFogHasTouched) {
        scratchFogHasTouched = true;
        scratchFogLastRegrowAt = millis();
    }

    if (!scratchFogSecondTextShown) {
        scratchFogSecondTextShown = true;

        setTimeout(() => {
            if (appState === "CHAPTER1_SCRATCH_FOG" && !scratchFogComplete) {
                showChapterText("Durma.\nY\u00fcz\u00fc siliniyor.");
            }
        }, 250);
    }

    eraseScratchFogAt(pointer.x, pointer.y, scratchFogPointerWasDown ? 0.95 : 0.82);
    scratchFogPointerWasDown = pointerDown;
}

function eraseScratchFogAt(x, y, pressure = 0.65) {
    if (!scratchFogEraseLayer) return;

    const ctx = scratchFogEraseLayer.drawingContext;
    const radius = constrain(min(width, height) * 0.095, 58, 90);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.08);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${0.98 * pressure})`);
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${0.72 * pressure})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.08, 0, TWO_PI);
    ctx.fill();

    ctx.restore();
}

function estimateScratchFogCompletion(layout) {
    if (!scratchFogLayer) return 0;

    const ctx = scratchFogLayer.drawingContext;
    const sampleLeft = constrain(floor(layout.left), 0, width - 1);
    const sampleTop = constrain(floor(layout.top), 0, height - 1);
    const sampleW = constrain(floor(layout.drawW), 1, width - sampleLeft);
    const sampleH = constrain(floor(layout.drawH), 1, height - sampleTop);
    const data = ctx.getImageData(sampleLeft, sampleTop, sampleW, sampleH).data;
    let checkedPixels = 0;
    let alphaSum = 0;
    const stride = 30;

    for (let y = 0; y < sampleH; y += stride) {
        for (let x = 0; x < sampleW; x += stride) {
            const screenX = sampleLeft + x;
            const screenY = sampleTop + y;

            if (!isNearScratchFogSilhouette(screenX, screenY, layout, 28)) continue;

            const alpha = data[(y * sampleW + x) * 4 + 3];
            checkedPixels++;
            alphaSum += alpha;
        }
    }

    if (!checkedPixels) return 0;

    scratchFogPeakAlpha = max(scratchFogPeakAlpha, alphaSum);

    if (scratchFogPeakAlpha < 200) return 0;

    const remaining = alphaSum / scratchFogPeakAlpha;
    return constrain(1 - remaining, 0, 1);
}

function drawScratchFogPressure(layout) {
    push();
    noStroke();

    const breath = map(noise(frameCount * 0.018 + 650), 0, 1, 0.45, 1);
    const edge = drawingContext.createRadialGradient(
        layout.drawX,
        layout.drawY - layout.drawH * 0.12,
        min(layout.drawW, layout.drawH) * 0.18,
        layout.drawX,
        layout.drawY - layout.drawH * 0.12,
        max(layout.drawW, layout.drawH) * 0.62
    );

    edge.addColorStop(0, "rgba(255, 255, 255, 0)");
    edge.addColorStop(0.58, `rgba(255, 255, 255, ${0.035 * breath * scratchFogFade})`);
    edge.addColorStop(1, `rgba(42, 40, 42, ${0.08 * breath})`);
    drawingContext.fillStyle = edge;
    rect(0, 0, width, height);
    pop();
}

function completeScratchFogScene() {
    if (scratchFogComplete) return;

    scratchFogComplete = true;
    scratchFogCompleteAt = millis();
    hideChapterText();
}

function startAfterScratchFogScene() {
    appState = "CHAPTER1_READY";
    hideChapterText();

    const chapterText = document.getElementById("chapter-text");

    if (chapterText) {
        chapterText.classList.remove("scratch-fog");
    }
}

function drawGroundedHandLookImage(img, sceneScale = 1, shaking = false, shakeAmount = 1) {
    const assetWidth = img.naturalWidth || img.width || 1080;
    const assetHeight = img.naturalHeight || img.height || 1920;
    const scaleFactor = ((height * 0.96) / assetHeight) * sceneScale;
    const drawW = assetWidth * scaleFactor;
    const drawH = assetHeight * scaleFactor;
    const shakeX = shaking ? random(-10, 10) * shakeAmount : 0;
    const shakeY = shaking ? random(-7, 7) * shakeAmount : 0;
    const drawX = width / 2 + shakeX;
    const drawY = height - drawH / 2 + shakeY;

    drawingContext.drawImage(img, drawX - drawW / 2, drawY - drawH / 2, drawW, drawH);
}

function getGroundedHandLookLayout(sceneScale = 1) {
    const assetWidth = 1080;
    const assetHeight = 1920;
    const scaleFactor = ((height * 0.96) / assetHeight) * sceneScale;
    const drawW = assetWidth * scaleFactor;
    const drawH = assetHeight * scaleFactor;
    const drawX = width / 2;
    const drawY = height - drawH / 2;

    return { drawW, drawH, drawX, drawY };
}

function drawHandLookLight(sceneScale, elapsed) {
    const layout = getGroundedHandLookLayout(sceneScale);
    const lightOn = handLookLightOffAt === null ? 1 : 1 - constrain((millis() - handLookLightOffAt) / 900, 0, 1);

    if (lightOn <= 0) return;

    const lightFade = constrain(elapsed / 900, 0, 1) * lightOn;
    const handX = layout.drawX;
    const handY = layout.drawY - layout.drawH / 2 + layout.drawH * 0.68;

    drawHandLightAt(handX, handY, min(layout.drawW, layout.drawH), lightFade);
}

function drawHandLightAt(handX, handY, baseSize, lightFade) {
    const pulse = map(noise(frameCount * 0.026), 0, 1, 0.42, 1);
    const shimmer = (sin(frameCount * 0.055) + 1) * 0.5;
    const glowPower = lerp(pulse, shimmer, 0.35);
    const lightAlpha = lightFade * map(glowPower, 0, 1, 80, 150);
    const glowAlpha = lightFade * map(glowPower, 0, 1, 28, 78);
    const glowSize = baseSize * map(glowPower, 0, 1, 0.28, 0.38);

    if (isiltiImg && isiltiImg.complete && isiltiImg.naturalWidth) {
        const lightSourceSize = isiltiImg.naturalWidth * 0.62;
        const lightSourceX = (isiltiImg.naturalWidth - lightSourceSize) / 2;
        const lightSourceY = isiltiImg.naturalHeight * 0.31;
        const lightDrawW = glowSize * 2.45;
        const lightDrawH = glowSize * 1.85;

        push();
        drawingContext.save();
        drawingContext.filter = `blur(${map(glowPower, 0, 1, 3, 7)}px)`;
        drawingContext.globalAlpha = glowAlpha / 190;
        drawingContext.drawImage(
            isiltiImg,
            lightSourceX,
            lightSourceY,
            lightSourceSize,
            lightSourceSize,
            handX - lightDrawW / 2,
            handY - lightDrawH / 2,
            lightDrawW,
            lightDrawH
        );
        drawingContext.restore();
        pop();
    }

    push();
    noStroke();
    const handGlow = drawingContext.createRadialGradient(handX, handY, 0, handX, handY, glowSize);
    handGlow.addColorStop(0, `rgba(255, 255, 245, ${lightAlpha / 520})`);
    handGlow.addColorStop(0.32, `rgba(255, 245, 205, ${glowAlpha / 560})`);
    handGlow.addColorStop(0.75, `rgba(205, 190, 255, ${glowAlpha / 980})`);
    handGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    drawingContext.fillStyle = handGlow;
    ellipse(handX, handY, glowSize * 2.15, glowSize * 1.55);

    fill(255, 255, 245, lightAlpha * 0.12);
    ellipse(handX, handY, glowSize * 0.52, glowSize * 0.34);
    pop();
}

function drawDelirdiDizzyImage(sceneScale, elapsed) {
    const dizzyStarted = elapsed > 1000;
    const dizzyProgress = dizzyStarted ? constrain((elapsed - 1000) / 4200, 0, 1) : 0;
    const dizzyPulse = dizzyStarted ? (sin(frameCount * 0.12) + 1) * 0.5 : 0;
    const shaking = dizzyStarted && (dizzyPulse > 0.42 || random() < 0.08);
    const dizzySway = dizzyStarted ? sin(frameCount * 0.045) * dizzyProgress : 0;

    push();
    drawingContext.save();

    if (dizzyStarted) {
        const blurAmount = lerp(0.25, 4.2, dizzyProgress) + dizzyPulse * 0.65;
        drawingContext.filter = `blur(${blurAmount}px)`;
    }

    translate(width / 2, height / 2);
    rotate(dizzySway * 0.008);
    translate(-width / 2, -height / 2);
    drawGroundedHandLookImage(handLookDelirdiImg, sceneScale * (1 + dizzyProgress * 0.018), shaking, 0.32);
    drawingContext.restore();
    pop();

    if (dizzyStarted) {
        push();
        drawingContext.globalAlpha = lerp(0.035, 0.14, dizzyProgress) + dizzyPulse * 0.035;
        drawGroundedHandLookImage(handLookDelirdiImg, sceneScale * (1.004 + dizzyProgress * 0.014), true, 0.22);
        pop();
    }
}

function drawHandLookInkSpots(elapsed, firstGlitchStart, growStart) {
    if (!handLookInkSpots.length) return;

    const firstStage = constrain((elapsed - firstGlitchStart) / 500, 0, 1);
    const slowGrow = constrain((elapsed - growStart) / 16000, 0, 1);
    const growAmount = 0.34 * firstStage + 1.55 * slowGrow;

    push();
    noStroke();

    for (let spot of handLookInkSpots) {
        const spotSize = spot.size * (0.82 + growAmount);
        const gradient = drawingContext.createRadialGradient(
            spot.x,
            spot.y,
            0,
            spot.x,
            spot.y,
            spotSize
        );

        gradient.addColorStop(0, `rgba(0, 0, 0, ${0.5 * spot.alpha})`);
        gradient.addColorStop(0.55, `rgba(0, 0, 0, ${0.28 * spot.alpha})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        drawingContext.fillStyle = gradient;
        ellipse(spot.x, spot.y, spotSize * 2, spotSize * 2);
    }

    pop();
}

function drawGlitchBurst(fromImg, toImg, sceneScale, intensity) {
    const burst = constrain(intensity, 0, 1.2);

    push();
    drawingContext.globalAlpha = 0.42;
    drawGroundedHandLookImage(toImg, sceneScale * random(0.998, 1.006), true, 0.45);
    pop();

    push();
    blendMode(ADD);
    tint(255, 70, 90, 48 * burst);
    drawGroundedHandLookImage(fromImg, sceneScale * 1.002, true, 0.35);
    tint(80, 170, 255, 42 * burst);
    drawGroundedHandLookImage(toImg, sceneScale * 0.999, true, 0.35);
    pop();

    drawGlitchNoise(0.22 * burst);
}

function drawGlitchNoise(strength) {
    push();
    noStroke();

    const amount = constrain(strength, 0, 1);

    for (let i = 0; i < 10; i++) {
        const y = random(height);
        const h = random(1, 9) * amount;
        fill(random([255, 0, 210]), random([255, 20, 80]), random([255, 40, 210]), random(10, 36) * amount);
        rect(random(-width * 0.08, width * 0.08), y, width * random(0.3, 0.82), h);
    }

    if (random() < 0.32 * amount) {
        fill(255, random(10, 26) * amount);
        rect(0, 0, width, height);
    }

    pop();
}

function easeOutCubic(t) {
    return 1 - pow(1 - t, 3);
}


function drawWhiteUncannyFog() {
    push();
    noStroke();
    blendMode(BLEND);

    let generalVisibility = map(noise(frameCount * 0.006), 0, 1, 0, 1);
    generalVisibility = pow(generalVisibility, 1.8);

    for (let i = 0; i < 9; i++) {
        let nX = noise(fogOffset + i * 35);
        let nY = noise(fogOffset + 200 + i * 47);
        let nSize = noise(fogOffset + 500 + i * 61);
        let nAlpha = noise(fogOffset + 900 + i * 29);

        let x = map(nX, 0, 1, -width * 0.2, width * 1.2);
        let y = map(nY, 0, 1, height * 0.02, height * 1.08);

        let size = map(nSize, 0, 1, width * 0.35, width * 1.05);
        size = constrain(size, 260, 880);

        let alpha = map(nAlpha, 0, 1, 6, 34) * generalVisibility;

        let gradient = drawingContext.createRadialGradient(
            x, y, 0,
            x, y, size
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha / 255})`);
        gradient.addColorStop(0.45, `rgba(255, 255, 255, ${(alpha * 0.45) / 255})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        drawingContext.fillStyle = gradient;
        ellipse(x, y, size * 2, size * 2);
    }

    drawAlmostHumanFogShape(generalVisibility);

    fogOffset += 0.0018;
    pop();
}

function drawAlmostHumanFogShape(generalVisibility) {
    let appear = noise(frameCount * 0.004 + 700);

    if (appear > 0.58) {
        let strength = map(appear, 0.58, 1, 0, 1);

        let x = width / 2 + map(noise(frameCount * 0.003 + 50), 0, 1, -90, 90);
        let y = height * 0.62 + map(noise(frameCount * 0.003 + 90), 0, 1, -30, 30);

        let alpha = 28 * strength * generalVisibility;

        let gradient = drawingContext.createRadialGradient(
            x, y, 0,
            x, y, 260
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha / 255})`);
        gradient.addColorStop(0.45, `rgba(255, 255, 255, ${(alpha * 0.4) / 255})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        drawingContext.fillStyle = gradient;

        ellipse(x, y, 140, 360);
        ellipse(x, y - 190, 75, 95);
    }
}

function drawUncannyFlash() {
    if (random() < 0.001) {
        flashAlpha = random(18, 42);
    }

    flashAlpha = lerp(flashAlpha, 0, 0.08);

    if (flashAlpha > 1) {
        noStroke();
        fill(255, 255, 255, flashAlpha);
        rect(0, 0, width, height);
    }
}

function showChoiceOverlay() {
    appState = "CHOICE_READY";

    if (gerginVid) {
        gerginVid.pause();
    }

    const line6 = document.getElementById("line-6");
    const choiceOverlay = document.getElementById("choice-overlay");

    if (line6) {
        line6.style.opacity = "1";
    }

    setTimeout(() => {
        if (choiceOverlay) {
            choiceOverlay.classList.add("active");
        }
    }, 1000);
}

function setupChoiceButtons() {
    const yesBtn = document.getElementById("btn-yes");
    const noBtn = document.getElementById("btn-no");

    if (yesBtn) {
        yesBtn.addEventListener("click", () => {
            startChoiceResult("YES");
        });
    }

    if (noBtn) {
        noBtn.addEventListener("click", () => {
            startChoiceResult("NO");
        });
    }
}

function startChoiceResult(type) {
    if (choiceState !== null) return;

    choiceState = type;
    choiceFinalAlpha = 0;
    choiceTextAlpha = 0;
    choiceTextIndex = 0;
    choiceTextTimer = 0;
    blackFaceInk = null;
    blackFaceInkStarted = false;

    const choiceOverlay = document.getElementById("choice-overlay");
    const choiceBox = document.getElementById("choice-box");
    const line6 = document.getElementById("line-6");

    if (choiceBox) {
        choiceBox.style.opacity = "0";
        choiceBox.style.transform = "scale(0.92)";
    }

    if (line6) {
        line6.style.opacity = "0";
    }

    setTimeout(() => {
        if (choiceOverlay) {
            choiceOverlay.classList.add("hide");
        }
    }, 300);

    if (type === "YES") {
        choiceTexts = [
            "Tamam. Onu biraz daha güvende tutalım.",
            "Biraz daha devam edelim."
        ];
    }

    if (type === "NO") {
        appState = "NO_REACTION";

        if (gerginVid) {
            gerginVid.pause();
        }

        screenShakeAmount = 5;
        screenShakeUntil = millis() + 1500;

        choiceTexts = [
            "Tamam. O zaman ona dokunmayalım.",
            "Biraz daha devam edelim."
        ];

        setTimeout(() => {
            blackFaceInk = new FaceInkSpot(lastFaceX, lastFaceY);
            blackFaceInkStarted = true;
        }, 1500);
    }
}

function drawChoiceResult() {
    if (choiceState === "YES") {
        choiceFinalAlpha = lerp(choiceFinalAlpha, 255, 0.025);

        noStroke();
        fill(255, 255, 255, choiceFinalAlpha);
        rect(0, 0, width, height);

        drawChoiceText();
    }

    if (choiceState === "NO") {
        drawNoUncannyLayer();

        if (blackFaceInkStarted && blackFaceInk) {
            blackFaceInk.update();
            blackFaceInk.display();

            if (blackFaceInk.currentSize > max(width, height) * 2.1) {
                choiceFinalAlpha = lerp(choiceFinalAlpha, 255, 0.035);
            }
        }

        noStroke();
        fill(0, 0, 0, choiceFinalAlpha);
        rect(0, 0, width, height);

        if (choiceFinalAlpha > 170) {
            drawChoiceText();
        }
    }
}

function drawNoUncannyLayer() {
    push();
    noStroke();

    let pulse = map(noise(frameCount * 0.035), 0, 1, 0.25, 1);

    fill(255, 255, 255, 18 * pulse);
    ellipse(width / 2, height * 0.58, 130, 360);
    ellipse(width / 2, height * 0.31, 70, 90);

    if (random() < 0.018) {
        fill(255, 255, 255, random(10, 26));
        rect(0, 0, width, height);
    }

    pop();
}

function drawChoiceText() {
    if (!choiceTexts.length) return;

    choiceTextTimer++;

    if (choiceTextTimer < 80) {
        choiceTextAlpha = lerp(choiceTextAlpha, 230, 0.035);
    } else if (choiceTextTimer < 180) {
        choiceTextAlpha = lerp(choiceTextAlpha, 230, 0.02);
    } else {
        choiceTextAlpha = lerp(choiceTextAlpha, 0, 0.04);
    }

    if (choiceTextTimer > 240) {
        choiceTextTimer = 0;
        choiceTextIndex++;

        if (choiceTextIndex >= choiceTexts.length) {
            choiceTexts = [];
            showChapterScreen();
            return;
        }
    }

    push();
    textAlign(CENTER, CENTER);
    textFont("Courier New");
    textSize(16);
    textLeading(28);

    if (choiceState === "YES") {
        fill(20, 20, 20, choiceTextAlpha);
    } else {
        fill(235, 235, 235, choiceTextAlpha);
    }

    text(choiceTexts[choiceTextIndex], width / 2, height * 0.48);
    pop();
}

function showChapterScreen() {
    if (chapterStarted) return;

    chapterStarted = true;

    setTimeout(() => {
        bgColor = CHAPTER_BG;

        const chapterScreen = document.getElementById("chapter-screen");

        if (chapterScreen) {
            chapterScreen.classList.remove("hide");
            chapterScreen.classList.add("active");
        }

        setTimeout(() => {
            if (chapterScreen) {
                chapterScreen.classList.add("hide");
            }

            setTimeout(() => {
                if (chapterScreen) {
                    chapterScreen.classList.remove("active");
                }

                startChapterOne();
            }, 2000);
        }, 2000);
    }, 1000);
}

function startChapterOne() {
    choiceState = null;
    appState = "CHAPTER1_KALABALIK";
    bgColor = CHAPTER_BG;
    targetVideoFadeAlpha = 0;
    videoFadeAlpha = 0;

    chapterFadeAlpha = 255;
    chapterFadeTarget = 0;
    chapterFadeColor = CHAPTER_BG;

    playVideoUntilLastSecond(
        kalabalikVid,
        "Herkes bir yere yetişiyor.\nKimse durup birbirine bakmıyor.",
        () => {
            hideChapterText();

            setTimeout(() => {
                appState = "CHAPTER1_BEYAZ_BEKLER";

                chapterFadeAlpha = 255;
                chapterFadeTarget = 0;
                chapterFadeColor = CHAPTER_BG;

                playVideoUntilLastSecond(
                    beyazBeklerVid,
                    "Beyaz da onların arasında.",
                    () => {
                        hideChapterText();
                        startChapterEnding();
                    },
                    1,
                    ENDING_BG
                );
            }, 120);
        }
    );
}

function playVideoUntilLastSecond(video, textToShow, onAlmostEnd, extraSeconds = 0, fadeOutColor = CHAPTER_BG) {
    if (!video) return;

    clearChapterVideoTimer();
    hideChapterText();

    video.elt.playbackRate = 1;
    video.stop();
    video.time(0);
    safePlayVideo(video, false);

    let textShown = false;
    let textHidden = false;
    let endingFadeStarted = false;
    let playbackAdjusted = false;

    chapterVideoTimer = setInterval(() => {
        const duration = video.elt.duration;
        const currentTime = video.elt.currentTime;

        if (!duration || !isFinite(duration)) return;

        if (!playbackAdjusted && extraSeconds > 0) {
            video.elt.playbackRate = duration / (duration + extraSeconds);
            playbackAdjusted = true;
        }

        if (!textShown && currentTime >= 1.3) {
            showChapterText(textToShow);
            textShown = true;
        }

        if (!textHidden && currentTime >= duration - 1.2) {
            hideChapterText();
            textHidden = true;
        }

        if (!endingFadeStarted && currentTime >= duration - 0.9) {
            chapterFadeColor = fadeOutColor;
            chapterFadeTarget = 255;
            endingFadeStarted = true;
        }

        if (currentTime >= duration - 0.12) {
            clearChapterVideoTimer();
            video.pause();
            onAlmostEnd();
        }
    }, 100);
}

function startChapterEnding() {
    appState = "CHAPTER1_ENDING";
    bgColor = ENDING_BG;
    chapterFadeAlpha = 0;
    chapterFadeTarget = 0;

    const chapterText = document.getElementById("chapter-text");

    if (chapterText) {
        chapterText.classList.add("black-ending");
    }

    hideChapterText();

    setTimeout(() => {
        showChapterText("Ama i\u00e7inde d\u0131\u015far\u0131 \u00e7\u0131kmak isteyen bir \u015fey var.");
    }, 1000);

    setTimeout(() => {
        hideChapterText();
    }, 5000);

    setTimeout(() => {
        if (chapterText) {
            chapterText.classList.remove("black-ending");
        }

        startCloseLightEnding();
    }, 6700);
}

function startCloseLightEnding() {
    appState = "CHAPTER1_CLOSE_LIGHT";
    closeLightStartedAt = millis();
    chapterFadeAlpha = 0;
    chapterFadeTarget = 0;

    const chapterText = document.getElementById("chapter-text");

    if (chapterText) {
        chapterText.classList.add("ending");
    }

    setTimeout(() => {
        showChapterText("Bunu ba\u015fkalar\u0131yla payla\u015fmay\u0131 d\u00fc\u015f\u00fcn\u00fcyor.");
    }, 700);

    setTimeout(() => {
        hideChapterText();
    }, 6000);

    setTimeout(() => {
        if (chapterText) {
            chapterText.classList.remove("ending");
        }

        startHandLookScene();
    }, 7000);
}

function startHandLookScene() {
    hideChapterText();
    loadHandLookImages();
    appState = "CHAPTER1_LOOK_HAND";
    bgColor = CHAPTER_BG;
    handLookStartedAt = millis();
    handLookFinished = false;
    handLookSecondTextShown = false;
    handLookLightOffAt = null;
    handLookInkSpots = createHandLookInkSpots();
    chapterFadeAlpha = 0;
    chapterFadeTarget = 0;

    const chapterText = document.getElementById("chapter-text");

    if (chapterText) {
        chapterText.classList.remove("ending");
        chapterText.classList.add("hand-look");
    }

    setTimeout(() => {
        showChapterText("Bir anl\u0131\u011f\u0131na yakla\u015fmaya karar veriyor.");
    }, 80);

    setTimeout(() => {
        hideChapterText();
    }, 3000);
}

function createHandLookInkSpots() {
    return [
        { x: width * 0.14, y: height * 0.34, size: min(width, height) * 0.048, alpha: 0.78 },
        { x: width * 0.86, y: height * 0.48, size: min(width, height) * 0.042, alpha: 0.72 },
        { x: width * 0.18, y: height * 0.72, size: min(width, height) * 0.038, alpha: 0.68 },
        { x: width * 0.78, y: height * 0.82, size: min(width, height) * 0.034, alpha: 0.62 }
    ];
}

function startChapterOneNextScene() {
    startPovParallaxScene();
}

function startPovParallaxScene() {
    hideChapterText();
    loadPovParallaxImages();
    setupPovParallaxInput();

    appState = "CHAPTER1_POV_PARALLAX";
    bgColor = CHAPTER_BG;
    povParallaxStartedAt = millis();
    povParallaxComplete = false;
    povParallaxCompleteAt = null;
    povParallaxLookCount = 0;
    povParallaxPromptStage = 0;
    povParallaxSuggestedDir = "right";
    povParallaxActiveLookDir = null;
    povParallaxLastCountedDir = null;
    povParallaxTarget = { x: 0, y: 0 };
    povParallaxCurrent = { x: 0, y: 0 };
    chapterFadeAlpha = 0;
    chapterFadeTarget = 0;

    const chapterText = document.getElementById("chapter-text");

    if (chapterText) {
        chapterText.classList.remove("hand-look", "ending", "black-ending");
        chapterText.classList.add("pov-parallax");
        updatePovPromptPosition();
    }

    setTimeout(() => {
        if (appState === "CHAPTER1_POV_PARALLAX") {
            showChapterText("Tepkilerini anlamaya \u00e7al\u0131\u015f.\nKalabal\u0131\u011f\u0131n sa\u011f taraf\u0131na bak.\nSonra farkl\u0131 yerlere kay.");
        }
    }, 350);
}

function startScratchFogScene() {
    appState = "CHAPTER1_SCRATCH_FOG";
    bgColor = CHAPTER_BG;
    videoFadeAlpha = 0;
    targetVideoFadeAlpha = 0;
    chapterFadeAlpha = 0;
    chapterFadeTarget = 0;
    hideChapterText();
    loadHandLookImages();
    ensureScratchFogLayer();

    scratchFogLayer.clear();
    scratchFogEraseLayer.clear();
    scratchFogStartedAt = millis();
    scratchFogLastGrowAt = millis();
    scratchFogLastRegrowAt = millis();
    scratchFogCompletion = 0;
    scratchFogPeakAlpha = 0;
    scratchFogLastEstimateAt = 0;
    scratchFogComplete = false;
    scratchFogCompleteAt = null;
    scratchFogFade = 1;
    scratchFogSecondTextShown = false;
    scratchFogHasTouched = false;
    scratchFogPointerWasDown = false;
    scratchFogBloomingBlobs = [];
    scratchFogPointerActive = false;

    const chapterText = document.getElementById("chapter-text");

    if (chapterText) {
        chapterText.classList.remove("hand-look", "pov-parallax", "ending", "black-ending");
        chapterText.classList.add("scratch-fog");
    }

    setTimeout(() => {
        if (appState === "CHAPTER1_SCRATCH_FOG") {
            const layout = getScratchFogBeyazLayout();
            addScratchFogBlobs(layout, 5, false);
            showChapterText("Beyaz kayboluyor.\nOnu burada tut.");
        }
    }, 350);
}

function showChapterText(text) {
    const chapterLine = document.getElementById("chapter-line");

    if (!chapterLine) return;

    chapterLine.textContent = text;

    requestAnimationFrame(() => {
        chapterLine.classList.add("visible");
    });
}

function hideChapterText() {
    const chapterLine = document.getElementById("chapter-line");

    if (!chapterLine) return;

    chapterLine.classList.remove("visible");
}

function clearChapterVideoTimer() {
    if (chapterVideoTimer) {
        clearInterval(chapterVideoTimer);
        chapterVideoTimer = null;
    }
}

function drawWave(minH, maxH, offset, gAlpha) {
    let xoff = 0;

    for (let x = 0; x <= width; x += 5) {
        let y1 = map(noise(xoff, offset), 0, 1, minH, maxH);
        let y2 = map(noise(xoff + 0.02, offset), 0, 1, minH, maxH);

        let gapNoise = noise(xoff * 1.5, offset, frameCount * 0.001);
        let localAlpha = map(gapNoise, 0.2, 0.7, 0, 255);

        localAlpha = constrain(localAlpha, 0, 255);

        let finalAlpha = min(gAlpha, localAlpha);

        if (finalAlpha > 10) {
            stroke(30, 30, 35, finalAlpha);
            line(x, y1, x + 5, y2);
        }

        xoff += 0.02;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    if (scratchFogLayer) {
        scratchFogLayer = null;
        scratchFogEraseLayer = null;
        ensureScratchFogLayer();

        if (appState === "CHAPTER1_SCRATCH_FOG" && !scratchFogComplete) {
            const layout = getScratchFogBeyazLayout();
            addScratchFogBlobs(layout, 5, false);
        }
    }
}

function mouseDragged() {
    if (appState === "CHAPTER1_SCRATCH_FOG") return false;
}

function touchMoved() {
    if (appState === "CHAPTER1_SCRATCH_FOG") return false;
}

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("btn-start");
    const uiLayer = document.getElementById("ui-layer");

    setupChoiceButtons();
    setupScratchFogPointerInput();

    startBtn.addEventListener("click", () => {
        uiLayer.classList.add("fade-out");

        primeVideoForMobile(beyazVid);
        primeVideoForMobile(gerginVid);
        primeVideoForMobile(kalabalikVid);
        primeVideoForMobile(beyazBeklerVid);

        requestPovMotionPermission();

        setTimeout(() => {
            appState = "TO_BLACK";

            inkSpots.push(new InkSpot(width / 2, height / 2));
            inkSpots.push(new InkSpot(width * 0.2, height * 0.8));
            inkSpots.push(new InkSpot(width * 0.8, height * 0.2));
        }, 500);

        setTimeout(() => {
            appState = "TO_WHITE";

            clearingSpots.push(new ClearingSpot(width * 0.3, height * 0.3));
            clearingSpots.push(new ClearingSpot(width * 0.7, height * 0.7));
            clearingSpots.push(new ClearingSpot(width / 2, height * 0.9));
        }, 4500);

        setTimeout(() => {
            appState = "STORY_READY";

            setTimeout(() => {
                const line1 = document.getElementById("line-1");

                videoFadeAlpha = 255;
                targetVideoFadeAlpha = 255;

                setTimeout(() => {
                    if (line1) line1.style.opacity = "1";
                    targetVideoFadeAlpha = 0;
                }, 100);

                setTimeout(() => {
                    if (line1) line1.style.opacity = "0";
                    targetVideoFadeAlpha = 255;
                }, 3900);

                setTimeout(() => {
                    appState = "STORY_MAHCUP";

                    beyazVid.time(0);
                    safePlayVideo(beyazVid, true);
                    targetVideoFadeAlpha = 0;

                    setTimeout(() => {
                        const line2 = document.getElementById("line-2");

                        if (line2) line2.style.opacity = "1";

                        setTimeout(() => {
                            if (line2) line2.style.opacity = "0";

                            setTimeout(() => {
                                const line3 = document.getElementById("line-3");

                                if (line3) line3.style.opacity = "1";

                                setTimeout(() => {
                                    if (line3) line3.style.opacity = "0";

                                    setTimeout(() => {
                                        targetVideoFadeAlpha = 255;

                                        setTimeout(() => {
                                            appState = "STORY_GERGIN";

                                            beyazVid.stop();
                                            gerginVid.time(0);
                                            safePlayVideo(gerginVid, false);

                                            targetVideoFadeAlpha = 0;

                                            setTimeout(() => {
                                                const line4 = document.getElementById("line-4");

                                                if (line4) line4.style.opacity = "1";

                                                setTimeout(() => {
                                                    if (line4) line4.style.opacity = "0";

                                                    setTimeout(() => {
                                                        const line5 = document.getElementById("line-5");

                                                        if (line5) line5.style.opacity = "1";

                                                        setTimeout(() => {
                                                            if (line5) line5.style.opacity = "0";
                                                        }, 3500);
                                                    }, 1500);
                                                }, 3500);
                                            }, 1000);

                                            setTimeout(() => {
                                                showChoiceOverlay();
                                            }, GERGIN_QUESTION_TIME);
                                        }, 1500);
                                    }, 1500);
                                }, 3500);
                            }, 2500);
                        }, 2800);
                    }, 500);
                }, 6800);
            }, 1500);
        }, 9000);
    });
});
