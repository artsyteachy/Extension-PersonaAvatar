const name = 'Persona Avatar';

const PERSONA_PANEL_ID = 'persona-panel';

let chatObserver = null;
let avatarClickHandler = null;
let currentPersonaSrc = null;

//
// SillyTavern life cycle hooks
//

export async function onInstall() {
    console.log(`${name} installed.`);
}

export async function onActivate() {
    setup();
}

export async function onUpdate() {
    console.log(`${name} updated.`);
}

export function onEnable() {
    setup();
}

export function onDisable() {
    teardown();
}

export async function onClean() {
    teardown();
}

export async function onUninstall() {
    teardown();
}

//
// Implementation
//

function isChatActive() {
    return document.getElementById('chat') !== null &&
           document.querySelector('#chat .welcomePanel') === null;
}

function createPanel() {
    if (document.getElementById(PERSONA_PANEL_ID)) return;

    const panel = document.createElement('div');
    panel.id = PERSONA_PANEL_ID;
    panel.className = 'zoomed_avatar draggable';
    panel.style.display = 'none';
    panel.innerHTML = `
        <div class="panelControlBar flex-container">
            <div class="fa-fw fa-solid fa-grip drag-grabber" id="${PERSONA_PANEL_ID}header"></div>
            <div class="fa-fw fa-solid fa-circle-xmark dragClose" id="${PERSONA_PANEL_ID}close"></div>
        </div>
        <div class="zoomed_avatar_container">
            <img
                class="zoomed_avatar_img"
                src=""
                data-izoomify-url=""
                data-izoomify-magnify="1.8"
                data-izoomify-duration="300"
                alt=""
            />
        </div>`;
    document.body.appendChild(panel);

    $(panel).find('.dragClose').on('click touchend', function (e) {
        e.stopImmediatePropagation();
        $(panel).fadeOut(250);
        currentPersonaSrc = null;
    });
}

function showPersonaAvatar(src) {
    const panel = document.getElementById(PERSONA_PANEL_ID);
    if (!panel) return;

    if ($(panel).is(':visible') && currentPersonaSrc === src) {
        $(panel).fadeOut(250);
        currentPersonaSrc = null;
        return;
    }

    const img = panel.querySelector('.zoomed_avatar_img');
    img.src = src;
    img.setAttribute('data-izoomify-url', src);
    currentPersonaSrc = src;
    $(panel).fadeIn(250);
}

function onPersonaAvatarClick(e) {
    const avatarEl = e.target.closest('.mes[is_user="true"] .avatar');
    if (!avatarEl) return;

    // Intercept before ST's document-level handler fires in bubble phase
    e.stopPropagation();

    const img = avatarEl.querySelector('img');
    if (!img) return;

    const thumbURL = img.src;
    // Persona thumbnails: /thumbnail?type=persona&file=<filename>
    // Full-res path mirrors what ST's getUserAvatar() returns: User Avatars/<filename>
    const src = thumbURL.includes('type=persona')
        ? `User Avatars/${thumbURL.substring(thumbURL.lastIndexOf('=') + 1)}`
        : thumbURL;

    showPersonaAvatar(src);
}

function removePanel() {
    document.getElementById(PERSONA_PANEL_ID)?.remove();
}

function onChatMutation() {
    if (isChatActive()) {
        createPanel();
    } else {
        removePanel();
    }
}

function setup() {
    const chat = document.getElementById('chat');
    if (chat && !chatObserver) {
        chatObserver = new MutationObserver(onChatMutation);
        chatObserver.observe(chat, { childList: true });
    }

    if (!avatarClickHandler) {
        avatarClickHandler = onPersonaAvatarClick;
        document.addEventListener('click', avatarClickHandler, true);
    }
}

function teardown() {
    if (avatarClickHandler) {
        document.removeEventListener('click', avatarClickHandler, true);
        avatarClickHandler = null;
    }
    currentPersonaSrc = null;
    removePanel();
    chatObserver?.disconnect();
    chatObserver = null;
}
