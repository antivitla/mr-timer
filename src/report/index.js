import moment from 'moment'
// import { Storage } from '@/store/storage'
import Entry from '@/models/entry'
import { Days } from '@/store/groups/days'
import { Tasks } from '@/store/groups/tasks'
import { extractTasks, hasTasks } from '@/utils/group'
import { taskDelimiter } from '@/store/ui'

function taskName (task, startFrom = 0) {
  let details = []
  if (!task.children || !task.children.length) {
    details = task.details.slice(startFrom)
  } else {
    details = task.path().slice(startFrom + 1)
  }
  return details.join(taskDelimiter)
}

function generateTasksSummary ({ children = Tasks.children, depth, nest = 0, currentNest = 0, sortBy = 'date' } = {}) {
  if (!nest || currentNest >= nest) {
    return extractTasks(children.filter(child => !(child instanceof Entry)), { depth }).map(task => {
      return {
        type: 'task',
        value: taskName(task, currentNest),
        duration: task.duration()
      }
    }).sort((a, b) => {
      if (sortBy === 'duration') {
        return b.duration - a.duration
      } else {
        return 0
      }
    })
  } else if (currentNest < nest) {
    return children
      .filter(child => !(child instanceof Entry))
      .map(task => {
        const item = {
          type: 'task',
          value: taskName(task, currentNest),
          duration: task.duration()
        }
        if (hasTasks(task)) {
          item.type = 'task nest'
          item.children = generateTasksSummary({
            children: task.children || [],
            depth,
            nest,
            sortBy,
            currentNest: currentNest + 1
          })
        }
        return item
      })
      .sort((a, b) => {
        if (sortBy === 'duration') {
          return b.duration - a.duration
        } else {
          return 0
        }
      })
  }
}

function generateDaysSummary () {
  return Days.children.map(day => {
    return {
      type: 'day',
      value: moment(day.name).toDate(),
      duration: day.duration()
    }
  })
}

function generateDaysTasksSummary ({ depth, nest = 0, sortBy = 'date' } = {}) {
  return Days.children.map(day => {
    return {
      type: 'day task nest',
      value: moment(day.name).toDate(),
      children: generateTasksSummary({
        children: day.children,
        depth,
        sortBy,
        nest: nest + 1,
        currentNest: 1
      }),
      duration: day.duration()
    }
  }).sort((a, b) => {
    if (sortBy === 'duration') {
      return b.duration - a.duration
    } else {
      return 0
    }
  })
}

export default {
  summary: {
    days: generateDaysSummary,
    tasks: generateTasksSummary,
    daysTasks: generateDaysTasksSummary
  }
}

/*

// PDF
// HTML
// Markdown
// OpenDocument Text

// OpenDocument Spreadsheet
// CSV text

// JSON to 3rd-party services

Цели:
- что делал, по дням, с датами и кратко названиями задач. Длительность. В конце (весь отчёт) - важно итого по всему отчёту. Обычно это отчёт за проект, разовый или небольшой халтурки. [Отчёт А]
- отчёт за период. Важно название периода, далее в принципе отчёт по дням, что делал (Отчёт А).

Контекст

Период

Итого время

История
  дата - задача - время
  дата - задача - время
  дата - задача - время
  дата - задача - время
  дата - задача - время

Сводка по дням и задачам
  дата                 время
        задача - время
        задача - время
        задача - время

Сводка по дням
  дата - время
  дата - время

Сводка по задачам
  задача - время
  задача - время
  задача - время

Сводка по проектам
  проект - время
  проект - время

Сводка по проектам и задачам
  проект                  время
          задача - время
          задача - время
          задача - время
  проект                  время
          задача - время
  задача                  время

История проектов
проект - задача - время
проект - задача - время
проект - задача - время
проект - задача - время
проект - задача - время
проект - задача - время

11.08.2017 . . . . . . 10:00
01.08.2017 . . . . . . 4:30
21.07.2017 . . . . . . 10:00

*/

/*

(если разовый проект)

# Netuleny / Adminka

Всего: 13 часов 40 минут = 10 030 руб

-------------------------------

# И-мне, август 2017

Всего: 12 часов 40 минут = 19 456 руб

## Сводка по дням и задачам

**16 июля 2017** . . . . . . . . . . . . . . . . . . . . . . . . **00:06** = $ 789

Netuleny / Админка / Редизайн редактирования туров trello.com/c/mlKKZCJa/906-админка-туры-29 (00:04)
Netuleny / Админка / piloting unity in contradiction (00:00) = $ 679
Netuleny / Админка / фильтры (00:01)

**14 июля 2017** . . . . . . . . . . . . . . . . . . . . . . . . **03:21** = $ 10

Netuleny / Админка / фильтры (02:51)
Netuleny / Админка / икона редактирования тура (00:30)

**13 июля 2017** . . . . . . . . . . . . . . . . . . . . . . . . **03:01** = $ 7 589

Netuleny / Админка / Редизайн редактирования туров trello.com/c/mlKKZCJa/906-админка-туры-29 (02:46)
Netuleny / front / фикс уведомляшки о подписке (00:14)

## Сводка по задачам

**Netuleny**  . . . . . . . **00:04**
**Админка** . . . . . . . . **00:00** = $ 679

## Сводка по дням

**16 июля 2017**  . . . . . **00:06** = $ 789
**14 июля 2017**  . . . . . **03:21** = $ 10
**13 июля 2017**  . . . . . **03:01** = $ 7 589

*/
