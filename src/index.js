import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    
    // открытие и закрытие модального окна
    // const  modalOpenClose = () => {
    //     const requestButtons = document.querySelectorAll('.button-request');
    //     const closeModalButton = document.querySelector('.close-icon_modal');
    //     const modalOverlay = document.querySelector('.modal__overlay');
    //     const modal = document.querySelector('.modal');
        
    //     const closeModal = () => {
    //         closeModalButton.removeEventListener('click', () => closeModal());
    //         modalOverlay.removeEventListener('click', (e) => {
    //             const withinBoundaries = e.composedPath().includes(modal);
    //             if (!withinBoundaries ) {
    //                 closeModal();
    //             }
    //         })
    //         modalOverlay.classList.remove('open');
    //         document.removeEventListener('keypress', (e) => {
    //             if (e.key === "Escape") {
    //                 e.stopPropagation();
    //                 closeModal();
    //             }
    //         }); 
    //     }

    //     const openModal = () => {
    //         modalOverlay.classList.add('open');

    //         // закрытие на крестик
    //         closeModalButton.addEventListener('click', () => closeModal());

    //         // закрытие на оверлей
    //         modalOverlay.addEventListener('mousedown', (e) => {
    //             const withinBoundaries = e.composedPath().includes(modal);
    //             if (!withinBoundaries ) {
    //                 closeModal();
    //             }
    //         })

    //         // закрытие на esc
    //         document.addEventListener('keypress', (e) => {
    //             if (e.key === "Escape") {
    //                 e.stopPropagation();
    //                 closeModal();
    //             }
    //         }); 
    //     }

    //     requestButtons.forEach((button) => {
    //         button.addEventListener('click', () => openModal());
    //         button.addEventListener('click', () => {
    //             requestButtons.forEach((button) => {
    //                 button.removeEventListener('click', () => openModal());
    //             })
    //         })
    //     })
        
    // }

    // const formSubmit = () => {
    //     const form = document.querySelector('.form');
    //     const submitButton = form.querySelector('button[type="submit"]');

    //     submitButton.addEventListener('click', (e) => {
    //         const modalOverlay = document.querySelector('.modal__overlay');

    //         e.stopPropagation();
    //         e.preventDefault();

    //         fetch('https://asv-rc.ru/asv-requests.php', {
    //             method: 'POST',
    //             body: new FormData(document.getElementById('form'))
    //         })
    //         .then(() => {
    //             alert('форма успешно отправлена');
    //             // props.setSuccess(true);
    //         })
    //         .catch(() => {
    //             alert('ошибка: форма не отправлена');
    //             // props.setSuccess(false);
    //         })
    //         .finally(() => {
    //             modalOverlay.classList.remove('open');
    //         });
    //     })
    // }
    
    // modalOpenClose();
    // formSubmit();
})