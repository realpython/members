exports.seed = (knex, Promise) => {
  return Promise.all([
    knex('codes').insert({
      verify_code: 'oGvufQsOUL7264B8M0g4J5lkr1VcyYiR'
    }),
    knex('codes').insert({
      verify_code: '6B4H498aCv33jf95NH0RIEtp3TJ725t5'
    }),
    knex('codes').insert({
      verify_code: 'n2H9KsgaT0tW5zgM23Oc22Cv00572DBE'
    }),
    knex('codes').insert({
      verify_code: 'MJLMVZwUhArep2332HD22gnc7aGp28O1'
    }),
    knex('codes').insert({
      verify_code: '7J2RQ4aYP02RiQ4717mPi3mzd9oP0tzG'
    }),
    knex('codes').insert({
      verify_code: '7Xaky5yWGpPQXO3o8Y7CCQaSvuTUVNkz'
    }),
    knex('codes').insert({
      verify_code: 'n0g9OKZw4Fb94X5992u5M0Y3kLJi7kdz'
    }),
    knex('codes').insert({
      verify_code: '1b2FIayoQvhs4xK5AJbTS7Az38YKow3M'
    }),
    knex('codes').insert({
      verify_code: '89m2ByF4XVE3jKBI4y0g4lE3imU7cmn0'
    }),
    knex('codes').insert({
      verify_code: 'dtGnT0oHDDlPl7HVOY9JFY0gvJy5Yaq7'
    })
  ]);
};
