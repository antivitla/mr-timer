import Group from '@/models/group'
import Task from '@/models/task'
import { Storage } from '@/store/storage'
import { rootDetails } from '@/utils/group'

// Singleton to keep task tree
export const Tasks = (new Group({
  resolvePath (entry) {
    return entry.details.slice(0)
  },
  constructors: [Task],
  name: 'tasks'
}))

export function TasksPlugin (store) {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'addEntry') {
      // Если есть контекст (это ветка дерева)
      // и если текущий узел это именно задача
      // (а может быть и месяц, день), то
      // работа для нас
      let resolvePath
      if (Storage.context) {
        // Нам надо получить путь задачи, но так как
        // контекстом может быть и время (месяц, день),
        // нужно выцеплять именно узлы задач. При этом
        // мы могли уже внутри контекста находиться,
        // а там уже укороченные пути, поэтому нам нужно
        // заново понять полный путь задачи контекста
        let contextRootPath = rootDetails(Storage.context)
        // При вставке задачи в дерево, мы используем "путь" записи.
        // У каждого дерева он свой, но для дерева "только задачи"
        // важны только "детали" (массив имен записи).
        // Чтоб построить дерево отбрасывая корни контекста,
        // укорачиваем путь
        resolvePath = function (entry) {
          return entry.details.slice(contextRootPath.length)
        }
      }
      Tasks.addEntry(mutation.payload.entry, 0, resolvePath)
    }
    if (mutation.type === 'removeEntry') {
      Tasks.removeEntry(mutation.payload.entry)
    }
    if (mutation.type === 'clearEntries') {
      Tasks.children = []
    }
  })
}
