class Template {
  constructor(template) {
    this.defaultTemplate = `<li data-titre="{{titre}}">{{contenu}}</li>`;
    this.template = template || this.defaultTemplate;
  }

  randomChoise = (html, tagName, pos) => {

    const regExp = new RegExp(`<${tagName}`, 'g');

    let nbMatch = 0;
    let newHTML = html.replace(regExp, function (match) {
      if (nbMatch++ == pos) {
        return `<${tagName} class='selected'`
      } else {
        return match;
      }
    })
    return newHTML;
  }

  itemList(items) {
    let view = "";

    for (let item of items) {
      let template = this.template;

      //
      let solution = 0;

      for (let [key, value] of Object.entries(item)) {
        //console.log(key,value);
        if (key == "answer") solution = value;
        template = template.replace(`{{${key}}}`, value);
      }
      //console.log(solution)
      //modif templat


      template = this.randomChoise(template, 'li', solution)

      //console.log(template);

      view = view + template;
    }
    return view;
  }
}


const modif = async () => {

  const data = await fetch(
    'https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple'
  );
  const questions = await data.json();

  quizz = questions.results;
  // console.table(quizz);


  const formatQuestions = [];

  quizz.forEach( (r) => {
    let q = {};

    console.table(r)

    q.question = r.question;
    const rand = Math.floor(Math.random() * 4);

    r.incorrect_answers.splice(rand, 0, r.correct_answer)
    //add the correct answer randomly in incorrect

    r.incorrect_answers.forEach((choice, index) => {
      q[`choice${index + 1}`] = choice;
    });
    q.answer = rand;

    formatQuestions.push(q)
  })
  //console.table(formatQuestions)

  return formatQuestions;
}

//
(async () => {
  const questions = await modif();
  t = new Template(
    `<div> <h1> {{question}} </h1> 
          <ul>
              <li>{{choice1}}</li>
              <li>{{choice2}}</li>
              <li>{{choice3}}</li>
              <li>{{choice4}}</li>
          </ul>     
        </div>`);

  let ui = document.querySelector(".testTemplate");

  ui.insertAdjacentHTML("beforeend", t.itemList(questions));

})()

//show();