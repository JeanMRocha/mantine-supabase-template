Prompt-Padrão — Projeto Agro em Go (com boas práticas) Baseado no React Native e supabase

Objetivo: gerar código e orientações em Go para o projeto Agro, sempre aplicando as boas práticas de design, legibilidade e modularidade.

🧠 PROMPT COMPLETO
Quero que você atue como um engenheiro de software sênior especializado em Go (Golang) e arquitetura limpa, aplicando as seguintes boas práticas e princípios em todas as respostas, exemplos e códigos do projeto Agro:

1. **SOLID**
   - Cada estrutura, função e pacote deve ter responsabilidade única (S).
   - O código deve ser aberto para extensão, fechado para modificação (O).
   - As interfaces devem respeitar substituição segura (L).
   - Prefira interfaces pequenas e específicas (I).
   - Sempre dependa de abstrações e não de implementações diretas (D).

2. **DRY — Don’t Repeat Yourself**
   - Nenhum trecho de lógica deve ser duplicado.  
   - Reutilize funções, helpers e pacotes coesos.

3. **KISS — Keep It Simple, Stupid**
   - Código claro, direto, sem abstrações desnecessárias.  
   - Funções pequenas e nomes autoexplicativos.

4. **YAGNI — You Aren’t Gonna Need It**
   - Implemente apenas o que é necessário agora, sem antecipar recursos futuros.

5. **Separation of Concerns**
   - Separe claramente as camadas:
     - domínio (regras de negócio)
     - aplicação (casos de uso)
     - infraestrutura (banco, APIs externas)
     - interface (CLI, HTTP)
   - Cada camada se comunica apenas via interfaces.

6. **Fail Fast**
   - Valide entradas e erros imediatamente.
   - Use retornos explícitos `if err != nil` e mensagens descritivas.

7. **Clean Code e Convenções Go**
   - Siga `gofmt`, `golint`, `Effective Go`.
   - Prefira composição a herança.
   - Estruture o projeto com `/cmd`, `/pkg`, `/internal`, `/configs`, `/api`.
   - Use nomes curtos, descritivos e idiomáticos.

8. **Documentação e Testes**
   - Cada função exportada deve ter comentário iniciando com seu nome.
   - Sempre incluir exemplos de testes unitários (`*_test.go`).
   - Explicar a decisão de design em comentários claros.

⚙️ Contexto do projeto:
O sistema Agro é um conjunto de APIs e serviços em Go que lidam com dados agrícolas (fazendas, sensores, clima, produtividade, etc.). O foco é escalabilidade, clareza e manutenibilidade.

🎯 Ao gerar código ou sugestões:
- Escreva sempre em Go idiomático.
- Inclua comentários de propósito e uso.
- Explique o raciocínio aplicado (por que e não só como).
- Evite frameworks pesados; use bibliotecas padrão do Go quando possível.
- Estruture o resultado conforme as camadas descritas.

Retorne o código já formatado, limpo e funcional, explicando brevemente como aplicar cada princípio no exemplo.

🧩 Exemplo de uso

“Usando o prompt-padrão do projeto Agro, gere um serviço de cadastro de fazendas com interface REST e persistência em PostgreSQL, seguindo SOLID, DRY, KISS e Separation of Concerns.”

💬 Resultado esperado:

Pacote /domain/farm com Farm e FarmService.

Interface FarmRepository.

Implementação em /infra/postgres.

Endpoint HTTP em /api/farm_handler.go.

Testes básicos com farm_service_test.go.

KISS — Keep It Simple, Stupid

Princípio: “Mantenha o código simples, direto e fácil de entender.”

💬 Significado

O código não precisa ser esperto ou “bonito”, ele precisa ser claro e funcional.
Muitos erros e bugs vêm da tentativa de “complicar” algo que podia ser simples.

🧩 Ideia central:

Se uma pessoa nova no projeto não entende o que o código faz em 5 segundos, ele pode ser simplificado.

❌ Exemplo ruim (código complicado demais)
package main

import "fmt"

func sum(numbers ...int) (result int) {
    for i := range numbers {
        result += numbers[i]
    }
    return
}

func main() {
    fmt.Println(sum([]int{1, 2, 3, 4, 5}...))
}


👉 Embora funcione, é desnecessariamente confuso para quem está começando.

✅ Exemplo bom (KISS aplicado)
package main

import "fmt"

func sum(numbers []int) int {
    total := 0
    for _, n := range numbers {
        total += n
    }
    return total
}

func main() {
    fmt.Println(sum([]int{1, 2, 3, 4, 5}))
}


💡 A versão simples é mais legível, mais fácil de testar, e mais intuitiva.

⚙️ Dicas para aplicar o KISS

Evite overengineering — só adicione complexidade quando ela for realmente necessária.

Prefira funções curtas com nomes claros.

Escolha a estrutura de dados mais simples que resolva o problema.

Não use abstrações prematuras (espere ter motivo real).

Se o código precisa de muito comentário para ser entendido, reescreva-o.

🧠 Resumo prático
Situação	Solução KISS
Código difícil de ler	Reescreva de forma clara
Muitos parâmetros	Use structs
Muita lógica em uma função	Divida em partes menores
Muitos “ifs” aninhados	Use early returns (if err != nil { return })

Princípios como KISS e DRY andam juntos:

DRY reduz repetição,

KISS reduz confusão.

Se quiser, posso te mostrar o próximo princípio complementar:
👉 YAGNI (You Aren’t Gonna Need It) — que ensina quando não programar algo.

Boas Práticas: DRY — Don’t Repeat Yourself

Princípio: “Não repita código ou lógica desnecessariamente.”

💡 O que significa na prática

Sempre que você se vê copiando o mesmo bloco de código em vários lugares, isso é um sinal de que precisa abstrair — criar uma função, método ou módulo reutilizável.

👉 O código duplicado aumenta erros, dificulta manutenção e cria inconsistência (você corrige em um lugar, mas esquece em outro).

📦 Exemplo ruim (sem DRY)
package main

import "fmt"

func main() {
    user := "Jean"
    fmt.Printf("Olá, %s! Seja bem-vindo.\n", user)

    admin := "Maria"
    fmt.Printf("Olá, %s! Seja bem-vindo.\n", admin)
}


➡️ Aqui, a lógica de saudação se repete.

✅ Exemplo bom (com DRY)
package main

import "fmt"

func greet(name string) {
    fmt.Printf("Olá, %s! Seja bem-vindo.\n", name)
}

func main() {
    greet("Jean")
    greet("Maria")
}


💡 Agora há uma única função responsável por saudar.
Se você quiser mudar a mensagem, basta alterar em um único lugar.

🧠 Benefícios do DRY

Código mais curto e legível.

Menos erros ao atualizar lógicas.

Facilidade de testes (você testa uma função genérica só uma vez).

Facilita aplicar SOLID, pois cada função tende a ter uma única responsabilidade.

Se quiser, posso te mostrar a próxima boa prática chamada KISS (Keep It Simple, Stupid) — que complementa o DRY e o SOLID na base de qualquer código limpo.

Metodologia SOLID (Boas práticas de design de software)

Cada letra representa um princípio:

🟦 S — Single Responsibility Principle

“Uma classe (ou função) deve ter apenas uma razão para mudar.”

👉 Significa:
Cada módulo deve fazer uma única coisa bem feita.
Evite misturar responsabilidades (ex: lógica de negócio + acesso a banco + log).

🧠 Benefício: facilita testes e manutenção.

💡 Exemplo em Go:

// Ruim: mistura regras e persistência
type UserService struct {}

func (s UserService) CreateUser(name string) {
    saveToDatabase(name)
    sendWelcomeEmail(name)
}

// Melhor: separar as responsabilidades
type UserRepository struct {}
type EmailService struct {}
type UserService struct {
    repo   UserRepository
    mailer EmailService
}

🟨 O — Open/Closed Principle

“Aberto para extensão, fechado para modificação.”

👉 Significa:
Você deve poder adicionar comportamentos sem alterar o código existente.
Use interfaces, composição e polimorfismo.

🧠 Benefício: evita quebrar código antigo ao adicionar algo novo.

💡 Exemplo em Go:

type Notifier interface {
    Send(msg string)
}

type EmailNotifier struct {}
func (e EmailNotifier) Send(msg string) { fmt.Println("Email:", msg) }

type SMSNotifier struct {}
func (s SMSNotifier) Send(msg string) { fmt.Println("SMS:", msg) }

func SendNotification(n Notifier, msg string) {
    n.Send(msg)
}


Você pode adicionar outro tipo (ex: PushNotifier) sem mudar SendNotification.

🟩 L — Liskov Substitution Principle

“Objetos de uma superclasse devem poder ser substituídos por objetos de suas subclasses sem quebrar o sistema.”

👉 Significa:
Se algo “parece ser” do mesmo tipo, ele deve se comportar como tal.
Não mude o comportamento esperado da interface.

💡 Exemplo em Go:

type Shape interface {
    Area() float64
}

type Square struct { Side float64 }
func (s Square) Area() float64 { return s.Side * s.Side }

type Circle struct { Radius float64 }
func (c Circle) Area() float64 { return math.Pi * c.Radius * c.Radius }

func PrintArea(s Shape) {
    fmt.Println(s.Area())
}


Square e Circle podem ser usados sem alterar o código de PrintArea.

🟧 I — Interface Segregation Principle

“Nenhum cliente deve ser forçado a depender de métodos que não usa.”

👉 Significa:
Prefira interfaces pequenas e específicas em vez de uma única interface gigante.

🧠 Benefício: reduz acoplamento e facilita testes.

💡 Exemplo em Go:

// Ruim: interface muito genérica
type Machine interface {
    Print()
    Scan()
    Fax()
}

// Melhor: interfaces específicas
type Printer interface { Print() }
type Scanner interface { Scan() }


Um dispositivo simples (como uma impressora barata) não precisa implementar Scan() e Fax().

🟥 D — Dependency Inversion Principle

“Dependa de abstrações, não de implementações.”

👉 Significa:
Módulos de alto nível não devem depender de módulos de baixo nível diretamente.
Ambos devem depender de interfaces (contratos).

💡 Exemplo em Go:

type Notifier interface {
    Send(msg string)
}

type UserService struct {
    notifier Notifier
}

func (s UserService) Register(name string) {
    fmt.Println("Usuário criado:", name)
    s.notifier.Send("Bem-vindo, " + name)
}


Aqui UserService depende da interface, não de um tipo concreto (como EmailNotifier).

🔁 Resumo rápido do SOLID
Letra	Princípio	Foco	Resumo
S	Single Responsibility	Organização	Uma função/classe faz uma coisa só
O	Open/Closed	Extensibilidade	Adicione sem modificar
L	Liskov Substitution	Consistência	Substituições não devem quebrar
I	Interface Segregation	Clareza	Interfaces pequenas e úteis
D	Dependency Inversion	Abstração	Dependa de contratos, não de detalhes

Se quiser, posso criar uma versão procedural do SOLID — ou seja, um passo a passo que a IA deve seguir ao propor qualquer código, aplicando cada letra em sequência (S → O → L → I → D).

1. YAGNI — You Aren’t Gonna Need It

“Não implemente algo até ter certeza de que precisa.”

👉 Evite prever necessidades futuras.
Cada “função que talvez use depois” é uma dívida técnica disfarçada.

💡 Exemplo:

// Ruim: adicionando recurso que não é necessário ainda
func calculate(a, b int, mode string) int {
    if mode == "sum" {
        return a + b
    } else if mode == "multiply" { // ainda não usamos multiplicar
        return a * b
    }
    return 0
}


✅ Melhor:

func sum(a, b int) int {
    return a + b
}


📘 Resumo: implemente o que o sistema precisa hoje, não o que você acha que vai precisar amanhã.

🧱 2. Separation of Concerns (Separação de Responsabilidades)

“Cada parte do sistema deve cuidar de uma responsabilidade específica.”

👉 Evita que lógica de negócio, banco de dados e interface fiquem misturadas.
É o coração das arquiteturas limpas (Clean Architecture, Hexagonal, MVC).

💡 Exemplo em Go:

// Camada de dados
type UserRepository struct {}
func (r UserRepository) Save(user User) error { /* salva no banco */ }

// Camada de negócio
type UserService struct {
    repo UserRepository
}
func (s UserService) CreateUser(name string) {
    s.repo.Save(User{Name: name})
}


📘 Resumo: separar responsabilidades deixa o código modular, testável e fácil de evoluir.

⚙️ 3. Fail Fast (Falhar Rápido)

“Descubra e trate erros o mais cedo possível.”

👉 O programa deve detectar inconsistências logo no início, em vez de deixar o erro se espalhar.

💡 Exemplo em Go:

if err := validateInput(input); err != nil {
    return fmt.Errorf("entrada inválida: %w", err)
}


📘 Resumo: quanto mais cedo um erro aparece, menor o impacto no resto do sistema.

📜 4. Convention over Configuration

“Siga convenções padrões em vez de reinventar.”

👉 Use o que a comunidade já consolidou — nomes, estruturas e padrões.
Em Go, por exemplo, use o estilo do gofmt, o cmd/ e pkg/ nas pastas, etc.

💡 Exemplo:

/cmd/app/main.go
/pkg/user/service.go
/pkg/user/repository.go


📘 Resumo: seguir convenções aumenta legibilidade e evita surpresas para outros desenvolvedores.

🧮 5. Composition Over Inheritance

“Prefira composição de comportamentos a herança de classes.”

👉 Go não tem herança clássica — e isso é bom!
Você combina estruturas e interfaces, em vez de criar hierarquias complexas.

💡 Exemplo em Go:

type Logger struct {}
func (l Logger) Log(msg string) { fmt.Println(msg) }

type Server struct {
    Logger // composição
}


📘 Resumo: composição é mais flexível e mais clara que herança.

🔍 6. Clean Architecture / Hexagonal Thinking

“Organize seu sistema em camadas independentes do mundo externo.”

👉 A lógica de negócio (domínio) não deve depender de banco, framework ou interface.
Tudo externo deve ser “plugável”.

💡 Resumo das camadas:

[ Domínio ] ← independente
[ Casos de uso ]
[ Adaptadores (HTTP, DB, CLI) ]


📘 Resumo: o código fica isolado, testável e portável (pode trocar banco ou API sem reescrever tudo).

⚡ 7. Clean Code e Legibilidade

“Código é lido muito mais vezes do que escrito.”

👉 Escolha nomes descritivos, funções curtas e comentários apenas quando necessários.

💡 Exemplo:

// Ruim
func x(u, p string) bool { return len(u) > 0 && len(p) > 0 }

// Bom
func isValidUserInput(username, password string) bool {
    return len(username) > 0 && len(password) > 0
}


📘 Resumo: o melhor código é aquele que dispensa explicações.

