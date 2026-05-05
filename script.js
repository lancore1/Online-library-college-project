const libraryCatalog = [ // Вхідний масив об'єктів
    {
        isbn: "001", "book title": "Грокаємо Алгоритми", author: { name: "Адітья Бхаргава", year: 2023 },
        category: "Algorithms & Data Structures", price: 560, pages: 328, "is borrowed": false
    },
    {
        isbn: "002", "book title": "Чистий код", author: { name: "Роберт Мартін", year: 2008 },
        category: "Handbook/Guide", price: 480, pages: 268, "is borrowed": false
    },
    {
        isbn: "003", "book title": "Багатий тато бідний тато", author: { name: "Роберт Кійосакі", year: 1997 },
        category: "Business/Investing", price: 250, pages: 310, "is borrowed": false
    },
    {
        isbn: "004", "book title": "Head First Go", author: { name: "Джей Макгаврен", year: 2018 },
        category: "Handbook/Guide", price: 4007, pages: 412, "is borrowed": false
    },
    {
        isbn: "005", "book title": "Патерни проєктування", author: { name: "Ерік Фрімен, Елізабет Робсон, Кеті Сьєрра, Берт Бейтс", year: 2020 },
        category: "Handbook/Guide", price: 1190, pages: 255, "is borrowed": false
    }
];

const catalogContainer = document.querySelector('#catalog-body');

if (catalogContainer) {

    libraryCatalog.forEach(item => {
        const row = document.createElement('tr');

        // Створюємо масив даних для ітерації, аби не дублювати код створення <td>
        row.innerHTML = `
        <td class="title-cell"></td>
        <td class="author-cell"></td>
        <td class="number-cell year-cell"></td>
        <td class="number-cell price-cell"></td>
        <td class="action-cell"></td>
    `;
        // Додаємо текст безпечно
        row.querySelector('.title-cell').textContent = item['book title'];
        row.querySelector('.author-cell').textContent = item.author.name;
        row.querySelector('.year-cell').textContent = item.author.year;
        row.querySelector('.price-cell').textContent = `${item.price} ₴`;

        // Створюємо кнопку "Детальніше"
        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = "Детальніше";
        detailsBtn.classList.add('details-button');
        // Зберігаємо унікальний ідентифікатор книги в самій кнопці (у вигляді мета даних)
        detailsBtn.dataset.isbn = item.isbn;

        row.querySelector('.action-cell').append(detailsBtn); // додаємо кнопку у таблицю
        catalogContainer.append(row);
    });
    // Один обробник на весь контейнер
    catalogContainer.addEventListener('click', (event) => {
        const row = event.target.closest('tr'); // отримуємо рядок з таблиці
        const isButton = event.target.classList.contains('details-button');

        // Додаємо клас active до рядку з таблиці
        if (row && !isButton) {
            row.classList.toggle('active');
        }

        // Перевіряємо чи натиснули ми саме на кнопку
        if (isButton) {
            // Отримуємо ID книги з кнопки, на яку натиснули
            const bookIsbn = event.target.dataset.isbn;

            // Знаходимо потрібну книгу в масиві за цим ID
            const item = libraryCatalog.find(book => book.isbn === bookIsbn);

            if (item) {
                alert(
                    `📖 Книга: ${item['book title']}\n` +
                    `👤 Автор: ${item.author.name}\n` +
                    `📂 Категорія: ${item.category}\n` +
                    `📄 Кількість сторінок: ${item.pages}`
                );
            }
        }
    })
}


// Обробник подій для форми
const objectForm = document.querySelector('#container-form');

function handleFormSubmit(evt) {
    evt.preventDefault(); // Зупиняємо перезавантаження   
    console.log("Форма відправлена, але сторінка не перезавантажилася!");
}
// Вішаємо обробник (перевіряючи на наявність форми)
if (objectForm) {
    objectForm.addEventListener('submit', handleFormSubmit);
}


// Маніпуляція класами
const popularGrid = document.querySelector('.smart-grid');

if (popularGrid) {
    popularGrid.addEventListener('click', (event) => {
        // Шукаємо найближчий елемент з класом book-item
        const bookCard = event.target.closest('.book-item');

        if (bookCard) {
            // Перемикаємо клас .selected
            bookCard.classList.toggle('selected');
        }
    });
}
// Унікальні категорії
const categorySet = new Set(libraryCatalog.map(v => v.category));
const categoryContainer = document.querySelector('#category-filter');

if (categoryContainer) {
    categorySet.forEach(item => {
        const option = document.createElement('option');
        option.textContent = item;
        option.value = item;
        categoryContainer.append(option);
    });
}

// Мапа для швидкого пошуку ціни 
const bookPrices = new Map();
libraryCatalog.forEach(v => bookPrices.set(v["book title"].toLocaleLowerCase(), v.price));

const searchInput = document.querySelector('#book-search');
const priceDisplay = document.querySelector('#price-display');

if (searchInput && priceDisplay) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim(); // Прибираємо зайві пробіли

        const price = bookPrices.get(query);

        if (price) {
            priceDisplay.textContent = price; // Оновлюємо текст, а не value
        } else {
            priceDisplay.textContent = "0";
        }
    });
}

const cartContent = document.querySelector('#cart-content');

if (catalogContainer && cartContent) {
    catalogContainer.addEventListener('click', (event) => {
        const row = event.target.closest('tr');

        const bookIsbn = row.querySelector('.details-button')?.dataset.isbn;
        if (!bookIsbn) return;

        if (row.classList.contains('active')) {
            // додавання у кошик
            const alreadyInCart = cartContent.querySelector(`[data-cart-isbn="${bookIsbn}"]`);
            if (alreadyInCart) return; // Якщо вже є не дублюємо

            const emptyMsg = cartContent.querySelector('.empty-msg');
            if (emptyMsg) emptyMsg.remove();

            const clone = row.cloneNode(true);
            clone.dataset.cartIsbn = bookIsbn; // унікальний ідентифікатор товару у кошику

            // Видаляємо непотрібні стовбці з рядка
            const actionCell = clone.querySelector('.action-cell');
            const numberCellYear = clone.querySelector('.year-cell');
            const authorCell = clone.querySelector('.author-cell');
            if (actionCell && numberCellYear && authorCell){
                actionCell.remove();
                numberCellYear.remove();
                authorCell.remove();
            }

            clone.classList.add('cart-item-copy', 'added-animation');
            cartContent.appendChild(clone); // додаємо елемент у кошик

            setTimeout(() => clone.classList.remove('added-animation'), 200);

        } else {
            // Видалення елемента з кошику
            const itemToRemove = cartContent.querySelector(`[data-cart-isbn="${bookIsbn}"]`);
            if (itemToRemove) {
                setTimeout(() => {
                    itemToRemove.remove(); // видаляємо елемент
                    if (cartContent.children.length === 0) {
                        cartContent.innerHTML = '<p class="empty-msg">Кошик порожній</p>';
                    }
                }, 200);
            }
        }
    });
}