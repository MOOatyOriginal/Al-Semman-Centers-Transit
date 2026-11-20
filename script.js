"use strict";

(() => {
    /* =====================================================
       01. ELEMENTS
    ===================================================== */

    const experience = document.getElementById("experience");
    const startButton = document.getElementById("start-button");
    const mainScreen = document.getElementById("main-screen");
    const audio = document.getElementById("intro-audio");
    const shareButton = document.getElementById("share-page-button");
    const workingHoursToggle = document.getElementById("working-hours-toggle");
    const workingHoursPanel = document.getElementById("working-hours");

    if (!experience || !startButton || !mainScreen) {
        console.error("AL-SEMMAN: Required page elements are missing.");
        return;
    }

    /* =====================================================
       02. TIMING
    ===================================================== */

    const TIMING = {
        gateExpansion: 1660,
        logoFormation: 7300,
        logoHold: 1000,
        campaignHold: 2000
    };

    let experienceStarted = false;
    let experienceFinished = false;

    const wait = (milliseconds) =>
        new Promise((resolve) => window.setTimeout(resolve, milliseconds));

    /* =====================================================
       03. AUDIO
    ===================================================== */

    function startIntroAudio() {
        if (!audio) return Promise.resolve(false);

        audio.pause();
        audio.currentTime = 0;

        return audio.play()
            .then(() => true)
            .catch((error) => {
                console.warn("Intro audio could not be played:", error);
                return false;
            });
    }

    function waitForAudioEnd() {
        if (!audio || audio.ended || audio.paused) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const finish = () => {
                audio.removeEventListener("ended", finish);
                audio.removeEventListener("error", finish);
                audio.removeEventListener("pause", finish);
                resolve();
            };

            audio.addEventListener("ended", finish, { once: true });
            audio.addEventListener("error", finish, { once: true });
            audio.addEventListener("pause", finish, { once: true });

            if (audio.ended || audio.paused) finish();
        });
    }

    /* =====================================================
       04. INTRO SEQUENCE
    ===================================================== */

    async function startExperience() {
        if (experienceStarted || experienceFinished) return;

        experienceStarted = true;
        startButton.disabled = true;
        startButton.setAttribute("aria-pressed", "true");

        // First: expand the illuminated circle to cover the entire screen.
        experience.classList.add("gate-expanding");

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        await wait(prefersReducedMotion ? 40 : TIMING.gateExpansion);

        // Reveal the logo scene only after the circle transition completes.
        experience.classList.remove("gate-expanding");
        experience.classList.add("intro-started", "logo-building");

        // Audio begins with the logo formation, never on the initial button press.
        const audioStarted = startIntroAudio();

        await wait(TIMING.logoFormation);
        await wait(TIMING.logoHold);

        experience.classList.add("campaign-active");

        if (await audioStarted) {
            await waitForAudioEnd();
        }

        await wait(TIMING.campaignHold);
        finishExperience();
    }

    function finishExperience() {
        if (experienceFinished) return;

        experienceFinished = true;
        experience.classList.add("is-finished");
        experience.setAttribute("aria-hidden", "true");
        mainScreen.setAttribute("aria-hidden", "false");

        // Keep #experience in the DOM for the CSS adjacent-sibling selector.
        if (audio) audio.pause();
    }

    /* =====================================================
       05. SHARE TRANSIT PAGE
    ===================================================== */

    async function sharePage() {
        const shareData = {
            title: document.title,
            text: "مراكز السمان للعلاج الطبيعي وتنظيم الوزن",
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareData.url);

                shareButton.setAttribute("aria-label", "تم نسخ رابط الصفحة");

                window.setTimeout(() => {
                    shareButton.setAttribute(
                        "aria-label",
                        "مشاركة صفحة الترانزيت"
                    );
                }, 1800);

                return;
            }

            window.prompt("انسخ رابط صفحة الترانزيت:", shareData.url);

        } catch (error) {
            if (error && error.name !== "AbortError") {
                console.error("Page sharing failed:", error);
            }
        }
    }

    /* =====================================================
       06. EVENTS & INITIAL STATE
    ===================================================== */

    startButton.addEventListener("click", startExperience);

    if (workingHoursToggle && workingHoursPanel) {
        workingHoursToggle.addEventListener("click", () => {
            const isExpanded = workingHoursToggle.getAttribute("aria-expanded") === "true";
            workingHoursToggle.setAttribute("aria-expanded", String(!isExpanded));
            workingHoursToggle.setAttribute(
                "aria-label",
                isExpanded ? "عرض مواعيد العمل" : "إخفاء مواعيد العمل"
            );

            if (isExpanded) {
                workingHoursPanel.hidden = true;
                workingHoursPanel.classList.remove("hours-expanded");
            } else {
                workingHoursPanel.hidden = false;
                // Restart the entrance animation whenever the panel opens.
                void workingHoursPanel.offsetWidth;
                workingHoursPanel.classList.add("hours-expanded");
            }
        });
    }

    if (shareButton) {
        shareButton.addEventListener("click", sharePage);
    }

    experience.classList.remove(
        "gate-expanding",
        "intro-started",
        "logo-building",
        "campaign-active",
        "is-finished"
    );

    experience.removeAttribute("aria-hidden");
    mainScreen.setAttribute("aria-hidden", "true");

    startButton.disabled = false;
    startButton.setAttribute("aria-pressed", "false");

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
})();