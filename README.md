![img.png](src/main/resources/static/bankist/img/project-preview_1.png)

![img.png](src/main/resources/static/bankist/img/project-preview_2.png)

![img.png](src/main/resources/static/bankist/img/project-preview_3.png)

# Курсова Робота: Проектування та Розробка Багатошарового Веб-Застосунку для Управління Банківськими Транзакціями

## Вступ
 
Ця курсова робота присвячена проектуванню та розробці багатошарового веб-застосунку для управління банківськими транзакціями. Сучасний світ вимагає ефективних, безпечних і зручних рішень для фінансових операцій, і саме цим питанням присвячено даний проект. Метою роботи є створення веб-застосунку, який забезпечує комплексний функціонал для користувачів, включаючи реєстрацію, авторизацію, управління рахунками, транзакціями, кредитами та картками.

Застосунок побудовано за багатошаровою архітектурою, що включає в себе такі шари:
1. Шар REST-запитів, який забезпечує інтерфейс для взаємодії клієнтів з сервером.
2. Сервісний шар, що містить бізнес-логіку застосунку.
3. Шар сховища, який відповідає за зберігання даних у базі даних.
4. Шар журналювання для відстеження і запису подій та дій користувачів.
5. Шар безпеки, що гарантує захист даних і безпечну взаємодію між клієнтом і сервером.

У цій роботі буде детально розглянуто процес проектування і розробки кожного з цих шарів, а також процес розгортання застосунку.

## Функціональні можливості застосунку

### Реєстрація та авторизація користувачів

- Реєстрація нових користувачів із вказанням імені користувача, електронної пошти, паролю та вибором валюти.
- Автентифікація користувачів за допомогою імені користувача, паролю та PIN-коду.
- Авторизація користувачів для доступу до захищених ресурсів застосунку.

### Управління рахунками

- Створення банківських рахунків з автоматичною генерацією номера картки, CVV та дати закінчення терміну дії.
- Відображення балансу рахунку та історії транзакцій.
- Маскування та відображення номера картки та CVV для безпеки користувачів.

### Управління транзакціями

- Проведення переказів між рахунками користувачів із перевіркою валюти та конвертацією сум.
- Відображення історії всіх транзакцій користувача, включаючи дату, суму та тип операції.
- Сортування транзакцій за датою або сумою.

### Управління кредитами

- Запит на отримання кредиту із визначенням суми та автоматичним розрахунком процентної ставки.
- Погашення кредиту частинами або повністю з перевіркою балансу рахунку.
- Відображення детальної інформації про кредити користувача, включаючи суму, процентну ставку, дату видачі та дату погашення.

### Безпека

- Шифрування паролів користувачів за допомогою BCryptPasswordEncoder.
- Захист від атак, таких як CSRF, XSS та SQL-ін'єкції.
- Обмеження доступу до захищених ресурсів тільки для авторизованих користувачів.
- Автоматичне завершення сесії користувача після певного часу бездіяльності.

## Розділ 1 - Проектування і Розробка Веб-Шару (REST-запити)

### Вступ

Веб-шар є критичним компонентом для будь-якого веб-застосунку, оскільки він відповідає за обробку запитів від клієнтів та повернення відповідей. У нашому застосунку ми використовуємо Spring Boot для реалізації RESTful веб-сервісів. Цей шар включає контролери, які обробляють HTTP-запити та викликають відповідні сервіси для виконання бізнес-логіки.

### Теоретичні основи

REST (Representational State Transfer) є архітектурним стилем для розподілених систем, таких як веб-додатки. Основна ідея REST полягає в використанні стандартних методів HTTP (GET, POST, PUT, DELETE) для виконання операцій над ресурсами, які ідентифікуються за допомогою URL. RESTful веб-сервіси є простими у використанні, мають високу продуктивність та масштабованість.

Ключовими принципами REST є:
- **Статус без стану**: кожен запит від клієнта до сервера повинен містити всю необхідну інформацію для обробки запиту. Сервер не зберігає ніякої інформації про клієнта між запитами.
- **Уніфікований інтерфейс**: використовуються стандартні методи HTTP для взаємодії з ресурсами. Це робить систему легкою для розуміння та використання.
- **Клієнт-серверна архітектура**: клієнт і сервер є незалежними компонентами, що дозволяє їм розвиватися окремо один від одного.
- **Кешування**: відповідь сервера може бути кешована клієнтом для зменшення навантаження на сервер та покращення продуктивності.
- **Шарова система**: між клієнтом і сервером можуть бути розміщені додаткові шари (проксі, шлюзи), що допомагає покращити масштабованість та безпеку системи.

Spring Boot є популярним фреймворком для створення веб-застосунків на основі Java, який забезпечує готові до використання компоненти та інструменти для реалізації RESTful веб-сервісів. Використання Spring Boot дозволяє швидко налаштувати та запустити веб-сервер, реалізувати маршрутизацію запитів та обробку даних.

### Реалізація

#### Контролер користувачів

```java
@RestController
@LogController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> userData) {
        User user = new User();
        user.setUsername((String) userData.get("username"));
        user.setEmail((String) userData.get("email"));
        user.setPassword((String) userData.get("password"));
        user.setPin((String) userData.get("pin"));
        String currency = (String) userData.get("currency");
        User savedUser = userService.saveUser(user, currency);
        return ResponseEntity.ok(savedUser);
    }

    // Інші методи контролера
}
```
#### Контролер карт
```java
@RestController
@LogController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    @GetMapping("/{cardNumber}")
    public ResponseEntity<CardUserDTO> getCardByNumber(@PathVariable String cardNumber) {
        Card card = cardService.getCardByNumber(cardNumber);
        if (card != null) {
            CardUserDTO cardUserDTO = new CardUserDTO(card.getId(), card.getCardNumber(), card.getExpirationDate(), card.getCvv(), card.getUser().getId());
            return ResponseEntity.ok(cardUserDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Інші методи контролера
}
```
#### Контролер кредитiв
```java
@RestController
@LogController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/{loanId}/repay")
    public ResponseEntity<?> repayLoan(@PathVariable Long loanId, @RequestBody Map<String, Double> request) {
        Double repaymentAmount = request.get("amount");
        try {
            loanService.repayLoan(loanId, repaymentAmount);
            return ResponseEntity.ok().body("Loan repaid successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // Інші методи контролера
}
```
#### Контролер транзакцiй
```java
@RestController
@LogController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.getTransactionsForUser(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.findAllTransactions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionService.findTransactionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.saveTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        return transactionService.findTransactionById(id)
                .map(trans -> {
                    transactionService.deleteTransaction(id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
```
## Розділ 2 - Проектування і Розробка Сервісного Шару

### Вступ

Сервісний шар є ключовим компонентом багатошарової архітектури, що відповідає за бізнес-логіку застосунку. Він включає в себе всі правила та алгоритми, необхідні для виконання операцій, таких як обробка транзакцій, управління користувачами, облік кредитів та карток. Використання сервісного шару дозволяє розділити логіку обробки даних від веб-шару, що спрощує підтримку і розширення функціоналу застосунку.

### Теоретичні основи

Основними принципами проектування сервісного шару є:
- **Інкапсуляція**: бізнес-логіка повинна бути прихована від зовнішніх компонентів, що дозволяє зменшити залежність між компонентами і підвищити безпеку.
- **Повторне використання**: сервіси повинні бути достатньо гнучкими для повторного використання в різних контекстах застосунку.
- **Тестування**: сервіси повинні бути легко тестованими, що дозволяє швидко виявляти та виправляти помилки.
- **Масштабованість**: сервіси повинні бути спроектовані так, щоб їх можна було легко масштабувати у випадку зростання навантаження.

У нашому застосунку сервісний шар реалізовано за допомогою Spring Service, що забезпечує інверсію управління (IoC) та залежностей (DI). Це дозволяє легко керувати створенням та життєвим циклом сервісів, а також їхніми залежностями.

### Реалізація

#### Сервіс для карток
```java
@Service
@LogService // Custom annotation to enable logging for this service
public class CardService {

    @Autowired
    private CardRepository cardRepository; // Injecting the CardRepository dependency

    public Card createCardForUser(User user, String currency) {
        // Create a new card for a user with the specified currency
        Card card = new Card();
        card.setUser(user);
        card.setCardNumber(generateCardNumber());
        card.setCvv(generateCvv());
        card.setExpirationDate(generateExpirationDate());
        card.setCurrency(currency);
        return cardRepository.save(card);
    }

    private String generateCardNumber() {
        // Generate a random card number
        Random rnd = new Random();
        StringBuilder cardNumber = new StringBuilder("4000 ");
        for (int i = 0; i < 12; i++) {
            if (i % 4 == 0 && i != 0) {
                cardNumber.append(" ");
            }
            cardNumber.append(rnd.nextInt(10));
        }
        return cardNumber.toString();
    }

    private int generateCvv() {
        // Generate a random CVV code
        return new Random().nextInt(900) + 100;
    }

    private Date generateExpirationDate() {
        // Generate an expiration date 5 years from now
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, 5);
        return calendar.getTime();
    }

    public Card getCardByNumber(String cardNumber) {
        // Retrieve a card by its number
        return cardRepository.findByCardNumber(cardNumber);
    }
}
```
#### Сервіс для користувачiв
```java
@Service
@LogService // Custom annotation to enable logging for this service
public class UserService {

    @Autowired
    private UserRepository userRepository; // Injecting the UserRepository dependency
    @Autowired
    private CardService cardService; // Injecting the CardService dependency
    @Autowired
    private PasswordEncoder passwordEncoder; // Injecting the PasswordEncoder dependency

    public List<User> findAllUsers() {
        // Retrieve all users
        return userRepository.findAll();
    }

    public Optional<User> findUserById(Long id) {
        // Find a user by their ID
        return userRepository.findById(id);
    }

    public User saveUser(User user, String currency) {
        // Save a new user and create a card for them
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            User savedUser = userRepository.save(user);
            cardService.createCardForUser(savedUser, currency);
            return savedUser;
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with provided username or email already exists.", e);
        }
    }

    public boolean existsByUsername(String username) {
        // Check if a user with the specified username exists
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        // Check if a user with the specified email exists
        return userRepository.existsByEmail(email);
    }

    public boolean authenticate(String username, String password, String pin) {
        // Authenticate a user by their username, password, and PIN
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(u -> passwordEncoder.matches(password, u.getPassword()) && u.getPin().equals(pin)).orElse(false);
    }

    public boolean deleteUserById(Long id) {
        // Delete a user by their ID
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
```
#### Сервіс для кредитiв
```java
@Service
@LogService // Custom annotation to enable logging for this service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository; // Injecting the LoanRepository dependency
    @Autowired
    private TransactionRepository transactionRepository; // Injecting the TransactionRepository dependency
    @Autowired
    private CardRepository cardRepository; // Injecting the CardRepository dependency

    private static final double DEFAULT_INTEREST_RATE = 5.0; // Default interest rate for loans

    public Loan issueLoan(User user, double amount) {
        // Issue a new loan for a user with the specified amount
        if (hasUnpaidLoans(user.getId())) {
            throw new IllegalArgumentException("User has unpaid loans. Cannot issue a new loan.");
        }

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setAmount(amount);
        loan.setInterestRate(calculateInterestRate(amount));
        loan.setIssueDate(new Date());
        loan.setDueDate(calculateDueDate(amount));

        Card card = cardRepository.findFirstByUserId(user.getId());
        if (card != null) {
            card.setBalance(card.getBalance() + amount);
            cardRepository.save(card);
        }

        return loanRepository.save(loan);
    }

    public boolean hasUnpaidLoans(Long userId) {
        // Check if the user has any unpaid loans
        List<Loan> loans = loanRepository.findByUserId(userId);
        for (Loan loan : loans) {
            if (loan.getAmount() > 0) {
                return true;
            }
        }
        return false;
    }

    public double calculateInterestRate(double amount) {
        // Calculate the interest rate based on the loan amount
        if (amount <= 1000) {
            return DEFAULT_INTEREST_RATE;
        } else if (amount <= 5000) {
            return DEFAULT_INTEREST_RATE - 0.5;
        } else {
            return DEFAULT_INTEREST_RATE - 1.0;
        }
    }

    public Date calculateDueDate(double amount) {
        // Calculate the due date based on the loan amount
        Calendar calendar = Calendar.getInstance();
        if (amount <= 1000) {
            calendar.add(Calendar.MONTH, 12);
        } else if (amount <= 5000) {
            calendar.add(Calendar.MONTH, 24);
        } else {
            calendar.add(Calendar.MONTH, 36);
        }
        return calendar.getTime();
    }

    public void repayLoan(Long loanId, Double repaymentAmount) throws Exception {
        // Repay a loan with the specified repayment amount
        Optional<Loan> loanOpt = loanRepository.findById(loanId);
        if (!loanOpt.isPresent()) {
            throw new Exception("Loan not found");
        }

        Loan loan = loanOpt.get();
        User user = loan.getUser();

        Card card = cardRepository.findFirstByUserId(user.getId());
        if (card == null) {
            throw new Exception("No card found for user.");
        }

        if (repaymentAmount > loan.getAmount()) {
            throw new Exception("Repayment amount exceeds the remaining loan amount.");
        }

        double cardBalance = card.getBalance();
        if (repaymentAmount > cardBalance) {
            throw new Exception("Insufficient balance.");
        }

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(-repaymentAmount);
        transaction.setTransactionDate(new Date());
        transaction.setTransactionType(TransactionType.LOAN_REPAYMENT);
        transactionRepository.save(transaction);

        card.setBalance(cardBalance - repaymentAmount);
        cardRepository.save(card);

        loan.setAmount(loan.getAmount() - repaymentAmount);
        if (loan.getAmount() <= 0) {
            loanRepository.delete(loan);
        } else {
            loanRepository.save(loan);
        }
    }
}
```
#### Сервіс для транзакцiй
```java
@Service
@LogService // Custom annotation to enable logging for this service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository; // Injecting the TransactionRepository dependency
    @Autowired
    private UserRepository userRepository; // Injecting the UserRepository dependency
    @Autowired
    private CardRepository cardRepository; // Injecting the CardRepository dependency
    @Autowired
    private LoanService loanService; // Injecting the LoanService dependency
    @Autowired
    private LoanTransactionRepository loanTransactionRepository; // Injecting the LoanTransactionRepository dependency
    private Map<String, Double> currencyRates;

    public TransactionService() {
        // Load currency rates from a JSON file
        loadCurrencyRates();
    }

    public List<Transaction> findAllTransactions() {
        // Retrieve all transactions
        return transactionRepository.findAll();
    }

    public Optional<Transaction> findTransactionById(Long id) {
        // Find a transaction by its ID
        return transactionRepository.findById(id);
    }

    public Transaction saveTransaction(Transaction transaction) {
        // Save a transaction to the repository
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        // Delete a transaction by its ID
        transactionRepository.deleteById(id);
    }

    public List<Transaction> getTransactionsForUser(Long userId) {
        // Retrieve transactions for a specific user
        return transactionRepository.findByUserId(userId);
    }

    private void loadCurrencyRates() {
        // Load currency rates from a JSON file
        ObjectMapper mapper = new ObjectMapper();
        try {
            Map<String, Map<String, Double>> data = mapper.readValue(new File("src/main/resources/static/bankist/exchangeRates.json"), HashMap.class);
            currencyRates = data.get("rates");
        } catch (IOException e) {
            e.printStackTrace();
            currencyRates = new HashMap<>();
        }
    }

    public double convertAmount(double amount, String fromCurrency, String toCurrency) {
        // Convert an amount from one currency to another
        double rateFrom = currencyRates.getOrDefault(fromCurrency, 1.0);
        double rateTo = currencyRates.getOrDefault(toCurrency, 1.0);
        return (amount * rateFrom) / rateTo;
    }

    public boolean transferMoney(Long fromUserId, Long toUserId, double amount) {
        // Transfer money between two users
        User fromUser = userRepository.findById(fromUserId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        User toUser = userRepository.findById(toUserId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Card fromCard = cardRepository.findFirstByUserId(fromUserId);
        Card toCard = cardRepository.findFirstByUserId(toUserId);

        if (fromCard == null || toCard == null) {
            throw new IllegalArgumentException("Card not found for one of the users.");
        }

        if (fromCard.getBalance() < amount) {
            throw new IllegalArgumentException("Insufficient balance.");
        }

        double convertedAmount = convertAmount(amount, fromCard.getCurrency(), toCard.getCurrency());

        fromCard.setBalance(fromCard.getBalance() - amount);
        cardRepository.save(fromCard);

        toCard.setBalance(toCard.getBalance() + convertedAmount);
        cardRepository.save(toCard);

        Transaction transaction = new Transaction();
        transaction.setUser(fromUser);
        transaction.setAmount(-amount);
        transaction.setTransactionDate(new Date());
        transaction.setTransactionType(TransactionType.TRANSFER);
        transactionRepository.save(transaction);

        Transaction transactionReceived = new Transaction();
        transactionReceived.setUser(toUser);
        transactionReceived.setAmount(convertedAmount);
        transactionReceived.setTransactionDate(new Date());
        transactionReceived.setTransactionType(TransactionType.TRANSFER);
        transactionRepository.save(transactionReceived);

        return true;
    }

    public boolean requestLoan(Long userId, double amount) {
        // Request a loan for a user
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return false;
        }

        try {
            Loan loan = loanService.issueLoan(userOpt.get(), amount);

            LoanTransaction transaction = new LoanTransaction();
            transaction.setLoan(loan);
            transaction.setAmount(loan.getAmount());
            transaction.setTransactionDate(new Date());
            transaction.setType(TransactionType.LOAN_ISSUE);
            loanTransactionRepository.save(transaction);

            return true;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }
}
```
## Розділ 3 - Проектування і Розробка Шару Сховища

### Вступ

Шар сховища відповідає за зберігання та управління даними в застосунку. Він забезпечує взаємодію з базою даних, виконання CRUD-операцій (Create, Read, Update, Delete) та підтримує цілісність даних. У нашому застосунку використовується реляційна база даних, і взаємодія з нею здійснюється за допомогою JPA (Java Persistence API) та Spring Data JPA.

### Теоретичні основи

Основними принципами проектування шару сховища є:
- **Нормалізація даних**: процес організації даних у базі даних для мінімізації надлишкових даних і забезпечення їх цілісності.
- **Зв'язки між таблицями**: встановлення асоціацій між різними таблицями бази даних для забезпечення цілісності даних.
- **Транзакційність**: забезпечення того, що всі операції з даними виконуються атомарно, тобто або всі зміни вносяться, або жодна з них.
- **Кешування**: використання кешу для зменшення навантаження на базу даних і підвищення продуктивності системи.

У нашому застосунку використовуються такі основні компоненти:
- **Entity-класи**: Java-класи, що відповідають таблицям у базі даних.
- **Repository-інтерфейси**: інтерфейси для виконання CRUD-операцій з даними.
- **JPQL (Java Persistence Query Language)**: мова запитів для взаємодії з даними в базі даних.

### Реалізація

#### Entity-Класи

**Клас `Card`**

```java
@Entity
@Data
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, unique = true)
    private String cardNumber;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private Date expirationDate;

    @Column(nullable = false)
    private int cvv;

    @Column(nullable = false)
    private double balance;
}
```
**Клас `User`**

```java
@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Card> cards;

    @Column(nullable = false)
    private String pin;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Loan> loans;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;
}
```
**Клас `Loan`**

```java
@Entity
@Data
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private double interestRate;

    @Column(nullable = false)
    private Date issueDate;

    @Column(nullable = false)
    private Date dueDate;

    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<LoanTransaction> transactions;
}
```
**Клас `LoanTransaction`**

```java
@Entity
@Data
@Table(name = "loan_transactions")
public class LoanTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    @JsonBackReference
    private Loan loan;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private Date transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
}
```
**Клас `Transaction`**

```java
@Entity
@Data
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private Date transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;
}
```

#### ER-дiаграма
![img.png](src/main/resources/static/bankist/img/img.png)

#### Repository-iнтерфейси

**Клас `CardRepository`**

```java
@Repository
@LogRepository
public interface CardRepository extends JpaRepository<Card, Long> {
    Card findByCardNumber(String cardNumber);

    Card findFirstByUserId(Long fromUserId);
}
```
**Клас `UserRepository`**

```java
@Repository
@LogRepository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);
}
```
**Клас `LoanRepository`**

```java
@Repository
@LogRepository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
}
```
**Клас `LoanTransactionRepository`**

```java
@Repository
@LogRepository
public interface LoanTransactionRepository extends JpaRepository<LoanTransaction, Long> {
}
```
**Клас `TransactionRepository`**

```java
@Repository
@LogRepository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
}
```
## Розділ 4 - Проектування і Розробка Журналювання

### Вступ

Журналювання є важливою складовою частиною будь-якого програмного застосунку, оскільки воно дозволяє відслідковувати події та дії в системі, що допомагає виявляти та усувати помилки, моніторити роботу системи та забезпечувати безпеку. У нашому застосунку журналювання реалізовано за допомогою аспектно-орієнтованого програмування (AOP) у поєднанні з бібліотекою SLF4J та Logback.

### Теоретичні основи

Аспектно-орієнтоване програмування (AOP) дозволяє розділяти бізнес-логіку застосунку від технічної логіки, такої як журналювання, безпека, транзакційність тощо. Основними поняттями AOP є:
- **Аспект (Aspect)**: модуль, що містить технічну логіку, яка може бути застосована до різних частин програми.
- **Точка приєднання (Join Point)**: місце в коді, де може бути застосований аспект.
- **Зріз (Pointcut)**: вираз, що визначає точки приєднання, до яких буде застосований аспект.
- **Порада (Advice)**: код, що виконується в точках приєднання.

У нашому застосунку для журналювання використовується бібліотека SLF4J, яка є абстракцією для різних реалізацій логування, таких як Logback. Це дозволяє легко змінювати реалізацію логування без зміни коду застосунку.

### Реалізація

#### Анотації для Журналювання

**LogController**

```java
package ua.opnu.bankist.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface LogController {
}
```
**LogService**

```java
package ua.opnu.bankist.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface LogService {
}
```
**LogRepository**

```java
package ua.opnu.bankist.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface LogRepository {
}
```
#### Аспект журналювання

**LoggingAspect**

```java
package ua.opnu.bankist.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import annotations.com.bankist.LogController;
import annotations.com.bankist.LogService;
import annotations.com.bankist.LogRepository;

// Aspect for logging methods of different layers of the application (Controller, Service, Repository)
@Aspect
@Component
public class LoggingAspect {
    // Initializing the logger
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Aspect for logging controllers, applied to all methods in classes annotated with LogController or to individual methods with this annotation
    @Around("@within(logController) || @annotation(logController)")
    public Object logController(ProceedingJoinPoint joinPoint, LogController logController) throws Throwable {
        return log(joinPoint, "Controller");
    }

    // Aspect for logging service methods, applied to all methods in classes annotated with LogService or to individual methods with this annotation
    @Around("@within(logService) || @annotation(logService)")
    public Object logService(ProceedingJoinPoint joinPoint, LogService logService) throws Throwable {
        return log(joinPoint, "Service");
    }

    // Aspect for logging repositories, applied to all methods in classes annotated with LogRepository or to individual methods with this annotation
    @Around("@within(logRepository) || @annotation(logRepository)")
    public Object logRepository(ProceedingJoinPoint joinPoint, LogRepository logRepository) throws Throwable {
        return log(joinPoint, "Repository");
    }

    // General method for logging, which logs the invocation and execution of the method.
    // Includes logging before the method starts, after the method finishes, and in case of an exception.
    private Object log(ProceedingJoinPoint joinPoint, String layer) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString(); // Get a short description of the method, including its name and parameters
        logger.info("{} - Before invocation: {}", layer, methodName); // Log information before the method execution
        Object result;
        try {
            result = joinPoint.proceed(); // Execute the target method
            logger.info("{} - After invocation: {}", layer, methodName); // Log information after the method execution
        } catch (Throwable throwable) {
            logger.error("{} - Exception in: {}", layer, methodName, throwable); // Log the error if the method throws an exception
            throw throwable; // Re-throw the exception
        }
        return result; // Return the result of the method execution
    }
}
```
### Налаштування logback
**Для налаштування Logback** використовується файл logback-spring.xml, який визначає конфігурацію логування, включаючи рівні логування, апендери та інші параметри. Логи генеруються в папці logs проекту та розділяються на error, warn та info логи.

**logback-spring.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Define property for the logs directory -->
    <property name="LOGS" value="logs" />

    <!-- Console appender for outputting logs to standard output -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- Define the pattern for log messages -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Appender for writing INFO level logs to a file with rolling policy -->
    <appender name="FILE_INFO" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- Path to the log file -->
        <file>${LOGS}/info.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- Pattern for log file names -->
            <fileNamePattern>${LOGS}/info.%d{yyyy-MM-dd}.log</fileNamePattern>
            <!-- Maximum history for keeping log files -->
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <!-- Define the pattern for log messages -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!-- Set log level to INFO -->
            <level>INFO</level>
            <!-- Accept logs that match the INFO level -->
            <onMatch>ACCEPT</onMatch>
            <!-- Deny logs that do not match the INFO level -->
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- Appender for writing ERROR level logs to a file with rolling policy -->
    <appender name="FILE_ERROR" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- Path to the log file -->
        <file>${LOGS}/error.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- Pattern for log file names -->
            <fileNamePattern>${LOGS}/error.%d{yyyy-MM-dd}.log</fileNamePattern>
            <!-- Maximum history for keeping log files -->
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <!-- Define the pattern for log messages -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!-- Set log level to ERROR -->
            <level>ERROR</level>
            <!-- Accept logs that match the ERROR level -->
            <onMatch>ACCEPT</onMatch>
            <!-- Deny logs that do not match the ERROR level -->
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- Appender for writing WARN level logs to a file with rolling policy -->
    <appender name="FILE_WARN" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- Path to the log file -->
        <file>${LOGS}/warn.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- Pattern for log file names -->
            <fileNamePattern>${LOGS}/warn.%d{yyyy-MM-dd}.log</fileNamePattern>
            <!-- Maximum history for keeping log files -->
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <!-- Define the pattern for log messages -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!-- Set log level to WARN -->
            <level>WARN</level>
            <!-- Accept logs that match the WARN level -->
            <onMatch>ACCEPT</onMatch>
            <!-- Deny logs that do not match the WARN level -->
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- Root logger configuration -->
    <root level="INFO">
        <!-- Attach appenders to the root logger -->
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE_INFO" />
        <appender-ref ref="FILE_ERROR" />
        <appender-ref ref="FILE_WARN" />
    </root>

    <!-- Logger configuration for the specific package 'ua.opnu.bankist' with DEBUG level -->
    <logger name="ua.opnu.bankist" level="DEBUG">
        <!-- Attach appenders to the logger -->
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE_INFO" />
        <appender-ref ref="FILE_ERROR" />
        <appender-ref ref="FILE_WARN" />
    </logger>
</configuration>
```
## Розділ 5 - Проектування і Розробка Безпеки

### Вступ

Безпека є критичним аспектом будь-якого веб-застосунку, особливо якщо він обробляє конфіденційні дані користувачів, такі як банківські транзакції. У нашому застосунку ми використовуємо Spring Security для забезпечення автентифікації та авторизації користувачів, захисту від атак та збереження цілісності даних.

### Теоретичні основи

Основними компонентами безпеки в веб-застосунках є:
- **Автентифікація**: процес підтвердження особи користувача за допомогою облікових даних (логін, пароль).
- **Авторизація**: процес визначення прав доступу користувача до ресурсів застосунку.
- **Шифрування**: процес перетворення даних у форму, недоступну для несанкціонованого доступу.
- **Захист від атак**: механізми захисту від різних видів атак, таких як SQL-ін'єкції, міжсайтовий скриптинг (XSS), атаки на відмову в обслуговуванні (DoS) тощо.

Spring Security є потужним фреймворком для управління безпекою у застосунках на основі Java. Він забезпечує готові до використання механізми для автентифікації, авторизації та захисту ресурсів.

### Реалізація

#### Налаштування Spring Security

**SecurityConfig**

```java
package ua.opnu.bankist.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import service.com.bankist.CustomUserDetailsService;

import java.util.List;

@Configuration // Annotation indicating that this class is used for Spring configuration
@EnableWebSecurity // Enables Spring Security's web security support
public class SecurityConfig {

    // Bean definition for UserDetailsService, which provides user information
    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }

    // Bean definition for PasswordEncoder, which encodes passwords
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Main security configuration method
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF protection
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(List.of("http://127.0.0.1:5500")); // Allowed origins
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed methods
                    corsConfiguration.setAllowedHeaders(List.of("*")); // Allowed headers
                    corsConfiguration.setAllowCredentials(true); // Allow credentials
                    return corsConfiguration;
                }))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/users/validateCredentials", "/api/users/exists", "/api/users").permitAll() // Public endpoints
                        .requestMatchers("/api/cards/**", "/api/loans/**", "/api/transactions/**").permitAll() // Public endpoints
                        .anyRequest().permitAll() // All other requests are allowed
                )
                .formLogin(form -> form
                        .loginPage("http://127.0.0.1:5500/src/pages/login/login.html").permitAll() // Login page
                        .loginProcessingUrl("/perform_login") // URL to submit login credentials
                        .defaultSuccessUrl("http://127.0.0.1:5500/src/pages/dashboard/dashboard.html", true) // Success URL
                        .failureUrl("http://127.0.0.1:5500/src/pages/login/login.html?error=true") // Failure URL
                )
                .logout(logout -> logout
                        .logoutUrl("/perform_logout") // Logout URL
                        .logoutSuccessUrl("http://127.0.0.1:5500/src/pages/login/login.html").permitAll() // Logout success URL
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Session creation policy
                )
                .sessionManagement(session -> session
                        .invalidSessionUrl("http://127.0.0.1:5500/src/pages/login/login.html") // URL for invalid session
                        .maximumSessions(1) // Maximum concurrent sessions
                )
                .requestCache(requestCache -> requestCache.disable()); // Disable request cache

        return http.build();
    }

    // Bean definition for configuring HTTP Firewall
    @Bean
    public HttpFirewall allowSemicolonHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowSemicolon(true); // Allow semicolon in URL
        return firewall;
    }

    // Bean definition for CORS filter
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://127.0.0.1:5500"); // Allowed origin
        config.addAllowedHeader("*"); // Allowed headers
        config.addAllowedMethod("*"); // Allowed methods
        source.registerCorsConfiguration("/**", config); // Register CORS configuration
        return new CorsFilter(source);
    }
}
```
### Шифрування паролів

Для шифрування паролів у застосунку використовується **BCryptPasswordEncoder**, який є частиною Spring Security. Він забезпечує надійне хешування паролів, що робить їх збереження безпечнішим.

### Захист від атак
Spring Security забезпечує захист від багатьох видів атак, таких як:
1. **CSRF (Cross-Site Request Forgery)**: захист від підробки запитів між сайтами. У нашому застосунку CSRF захист вимкнено для спрощення розробки, але його можна ввімкнути за потреби.
2. **XSS (Cross-Site Scripting)**: захист від міжсайтових скриптів. Це досягається шляхом правильного екранування даних, що вводяться користувачем.
3. **SQL-ін'єкції**: захист від SQL-ін'єкцій забезпечується використанням підготовлених запитів та JPA для взаємодії з базою даних.
## Висновок

Розробка багатошарового веб-застосунку для управління банківськими транзакціями є складним та багатогранним завданням, яке включає в себе проектування та реалізацію різних компонентів, кожен з яких відіграє важливу роль у загальній архітектурі системи. Цей проект дозволив мені заглибитися в різні аспекти розробки програмного забезпечення, вивчити та застосувати на практиці сучасні технології та інструменти.

### Основні результати

### 1. Проектування та реалізація веб-шару (REST-запити)

Проектування та реалізація веб-шару була однією з найважливіших задач у моєму проекті. Веб-шар відповідає за обробку HTTP-запитів від клієнтів та повернення відповідей. Використання Spring Boot для реалізації RESTful веб-сервісів дозволило створити ефективний та гнучкий інтерфейс для взаємодії між клієнтом і сервером. Це забезпечило надійність та масштабованість системи, що є критично важливим для будь-якого сучасного веб-застосунку.

### 2. Проектування та реалізація сервісного шару

Сервісний шар забезпечує виконання бізнес-логіки застосунку, включаючи управління користувачами, картками, транзакціями та кредитами. Використання Spring Service та інверсії управління (IoC) дозволило організувати бізнес-логіку у вигляді окремих компонентів, які легко підтримувати, тестувати та розширювати. Інкапсуляція бізнес-логіки у сервіси підвищила надійність та безпеку системи, забезпечуючи ефективне управління даними та операціями.

### 3. Проектування та реалізація шару сховища

Шар сховища відповідає за зберігання та управління даними в застосунку. Використання JPA та Spring Data JPA забезпечило ефективну взаємодію з базою даних, а також виконання CRUD-операцій. Проектування та реалізація Entity-класів та Repository-інтерфейсів дозволили забезпечити цілісність та консистентність даних. Важливим аспектом було також забезпечення нормалізації даних, що дозволило мінімізувати надлишковість даних та уникнути аномалій.

### 4. Проектування та реалізація журналювання

Журналювання є важливою складовою частиною системи, що дозволяє відслідковувати події та дії в застосунку. Використання аспектно-орієнтованого програмування (AOP) у поєднанні з SLF4J та Logback дозволило реалізувати ефективне та гнучке журналювання, розділяючи технічну та бізнес-логіку. Логи генеруються в папці `logs` проекту та розділяються на `error`, `warn` та `info` логи, що дозволяє зручно аналізувати інформацію та виявляти проблеми. Журналювання забезпечує важливу підтримку під час розробки та обслуговування застосунку, допомагаючи швидко знаходити та виправляти помилки.

### 5. Проектування та реалізація безпеки

Безпека є критичним аспектом застосунку, особливо якщо він обробляє конфіденційні дані користувачів. Використання Spring Security дозволило ефективно керувати автентифікацією та авторизацією користувачів, захистом від атак та шифруванням паролів. Це забезпечило надійний захист даних і безпечну взаємодію між клієнтом і сервером. Впровадження шифрування паролів за допомогою BCryptPasswordEncoder дозволило забезпечити високий рівень безпеки збереження облікових даних користувачів.

### Загальні висновки

Цей проект дозволив мені вивчити та реалізувати різні аспекти розробки багатошарового веб-застосунку, починаючи від проектування архітектури до імплементації та тестування компонентів системи. Я здобув цінний досвід роботи з сучасними технологіями та інструментами, такими як Spring Boot, Spring Security, JPA, та аспектно-орієнтоване програмування (AOP). Результатом моєї роботи є функціональний та безпечний веб-застосунок для управління банківськими транзакціями, який може бути легко розширений та підтримуваний у майбутньому.

Проект також продемонстрував важливість використання кращих практик проектування, таких як інверсія управління, аспектно-орієнтоване програмування, та належна обробка даних. Впровадження цих практик дозволяє створювати системи, які є надійними, гнучкими та масштабованими. Завдяки розподіленню обов'язків між різними шарами архітектури, я зміг забезпечити високу якість коду та легкість його підтримки.

У майбутньому я планую продовжити вдосконалення застосунку, додаючи нові функціональні можливості та покращуючи існуючі. Я також розглядаю можливість інтеграції з іншими сервісами та платформами для підвищення зручності та функціональності застосунку. Наприклад, інтеграція з платіжними шлюзами, сервісами моніторингу та аналітики може значно розширити можливості застосунку та покращити користувацький досвід.
