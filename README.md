# Sorriso Brilhante

## Apresentação

O **Sorriso Brilhante** é uma aplicação web educativa desenvolvida como parte de uma ação de extensão universitária, em colaboração com um aluno de graduação em Odontologia. O projeto foi concebido para apoiar atividades de educação em saúde bucal voltadas ao atendimento infantil na clínica, auxiliando no engajamento das crianças durante as orientações de higiene oral.

A proposta é tornar o processo educativo mais lúdico, interativo e acessível. Por meio de atividades e recursos visuais, a aplicação busca contribuir para a adesão às práticas corretas de escovação e para a promoção da saúde bucal desde a infância. O sistema tem caráter educativo e complementar, não substituindo a orientação profissional ou a avaliação clínica individual.

## Recursos da aplicação

- Alternância entre o modo infantil e o guia informativo para familiares.
- Cronômetro interativo de dois minutos, com orientações organizadas por regiões da boca.
- Atividade interativa sobre alimentos e saúde bucal, com feedback e acompanhamento da pontuação.
- Diário de escovação para registrar atividades da manhã e da noite.
- Conteúdo informativo sobre dentifrício fluoretado, trauma dentário e dúvidas frequentes sobre saúde bucal infantil.
- Interface responsiva, adequada a dispositivos móveis e computadores.

## Tecnologias e armazenamento

A aplicação foi desenvolvida com **HTML, CSS e JavaScript puro**, sem dependências externas ou bibliotecas de terceiros necessárias para seu funcionamento. A fonte Nunito pode ser carregada do Google Fonts; se não houver conexão, são utilizadas fontes alternativas disponíveis no sistema.

O diário de escovação e o progresso do quiz são armazenados localmente no navegador, por meio de `localStorage`. Esses dados permanecem no dispositivo e no navegador em que foram registrados; não são enviados a um servidor nem sincronizados entre dispositivos.

## Execução local

Não é necessário instalar dependências nem executar uma etapa de compilação. Na pasta do projeto, inicie um servidor local:

```powershell
py -m http.server 8000
```

Se o comando `py` não estiver disponível, utilize:

```powershell
python -m http.server 8000
```

Em seguida, acesse [http://localhost:8000](http://localhost:8000) no navegador. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

## Publicação no GitHub Pages

1. Envie `index.html`, `style.css` e `script.js` para a raiz de um repositório no GitHub.
2. No repositório, acesse **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Selecione a branch desejada, como `main`, e a pasta **/(root)**; em seguida, clique em **Save**.
5. Após a publicação, acesse o endereço disponibilizado na seção **Pages**.

Por ser um site estático, o projeto não exige configuração de build para publicação.
