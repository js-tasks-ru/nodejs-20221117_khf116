# Юнит тестирование (Решение)

Как я отмечал на занятии тестирование — это отдельный вид программирования и совершенствование в нем требует написания 
большого количества тестов. Таким образом подходов к написанию тестов существует множество, стилей и вариантов — еще 
больше. 
В этой задаче мы с вами подойдем к написанию тестов с максимально практической точки зрения и проверим лишь те 2-3 
условия, которые нам даны в задании. 

Во-первых, давайте допишем проверки для строковых полей, помимо собственно проверки на слишком короткое поле неплохо бы
проверить также слишком длинное. По аналогии с уже написанным вариантом можно сделать так:
```js
      errors = validator.validate({ name: 'Lalalalalalalalalalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 22');
```

Перезапускаем.. Пока все отлично, давайте добавим также тестов для числового поля:

```js
it('валидатор проверяет числовые поля', () => {
  const validator = new Validator({
    age: {
      type: 'number',
      min: 10,
      max: 20,
    },
  });

  let errors = validator.validate({ age: 4 });

  expect(errors).to.have.length(1);
  expect(errors[0]).to.have.property('field').and.to.be.equal('age');
  expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 4');

  errors = validator.validate({ age: 30 });

  expect(errors).to.have.length(1);
  expect(errors[0]).to.have.property('field').and.to.be.equal('age');
  expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 30');
});
```

Перезапускаем.. Любопытно, наш тест упал — валидатор в случае передачи слишком большого значения почему-то не 
возвращает верхний лимит (20), а возвращает по-прежнему нижний (10), необходимо поправить это условие:
```js
if (value > rules.max) {
  errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
}
```

Дополнительно обязательно добавим условия с правильно заданными полями, это всегда полезно сделать, чтобы убедиться что 
все работает как и ожидается.

В конце протестируем более реальный сложный кейс, когда передаются несколько полей, причем в них допущены ошибки типов:
```js
it('валидатор проверяет несколько полей', () => {
  const validator = new Validator({
    name: {
      type: 'string',
      min: 10,
      max: 20,
    },
    age: {
      type: 'number',
      min: 10,
      max: 20,
    },
  });

  let errors = validator.validate({ name: 10, age: 'Lalala' });

  expect(errors).to.have.length(2);

  expect(errors[0]).to.have.property('field').and.to.be.equal('name');
  expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');

  expect(errors[1]).to.have.property('field').and.to.be.equal('age');
  expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
});
```

Запускаем... Интересно, наш валидатор вернул лишь одну ошибку, вместо двух. Это еще один баг в реализации, когда 
валидатор находит ошибку типа вместо того, чтобы перейти к следующему полю он инициирует выход из функции, что делать
вовсе неправильно. Давайте исправим эту ошибку:
```js
if (type !== rules.type) {
  errors.push({field, error: `expect ${rules.type}, got ${type}`});
  continue;
}
```

Вот теперь у нас получился более стабильный валидатор, а также хорошо написанные тесты. 

Конечно же на этом вовсе необязательно останавливаться — мы можем проверить еще множество вещей, а также различных 
сочетаний передаваемых правил и объектов. Вы всегда можете использовать этот пример для основы при написании тестов,
однако в каждом конкретном случае добавлять или изменять их набор и содержимое.