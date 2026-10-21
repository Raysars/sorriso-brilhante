# SORRIAÊ

O **SORRIAÊ** é uma aplicação web educativa com orientações de saúde bucal infantil para crianças, pais e responsáveis. O conteúdo reúne cuidados por fase da infância, técnica de escovação, quantidade de creme dental fluoretado, alimentação e como agir em caso de trauma dentário.

## Recursos

- Área infantil com cronômetro de escovação de dois minutos, quiz sobre alimentos e diário de escovação.
- Guia para a família com orientações do PDF por idade, demonstrações visuais e instruções sobre trauma dentário.
- Interface responsiva e acessível, com HTML semântico, controles por teclado e preferência por movimento reduzido.
- Progresso do quiz e diário armazenados localmente no navegador; os dados não são enviados a um servidor.

O material do PDF apresenta uma divergência sobre a quantidade de creme dental para crianças de 1 a 3 anos. O guia sinaliza essa diferença e recomenda confirmar a quantidade com o dentista da criança.

## Tecnologias e execução

A aplicação usa HTML, CSS e JavaScript puros, sem dependências ou etapa de compilação. As imagens do projeto estão na pasta `assets/`.

Na pasta do projeto, inicie um servidor local:

```powershell
py -m http.server 8000
```

Se `py` não estiver disponível, use:

```powershell
python -m http.server 8000
```

Abra [http://localhost:8000](http://localhost:8000) no navegador.

## Publicação no GitHub Pages

1. Envie `index.html`, `style.css`, `script.js` e a pasta `assets/` para a raiz do repositório.
2. Em **Settings → Pages**, escolha **Deploy from a branch**.
3. Selecione a branch desejada e a pasta **/(root)** e salve.

O conteúdo é educativo e não substitui avaliação ou orientação individual de um cirurgião-dentista ou odontopediatra.
