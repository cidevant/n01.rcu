window.addEventListener('DOMContentLoaded', () => {
    const sendMessageButton = document.getElementById('submit_button');

    sendMessageButton.onclick = async (e) => {
        e.preventDefault();

        await sendMessage({ test: 'DATA' });
    }
});
