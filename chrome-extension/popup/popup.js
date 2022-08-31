window.addEventListener('DOMContentLoaded', () => {
    


    $('#submit_button').on('click', async () => {
        await sendMessage({ test: 'DATA' });
    })
});
