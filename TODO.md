# TODO - Frontend for Batches

## Plan (approved)
- Create Inertia pages for Batches: Index, Create, Edit, Show
- Create Batches components: table/list, columns, batch form modal
- Create dialogs for Use stock and Adjust stock
- Ensure `batches` is handled as paginated Inertia data
- Delete/edit actions wired from table

## Steps
- [ ] Gather exact pagination shape used by Inertia for `BatchController@index`
- [ ] Implement `resources/js/pages/pharmacy/batches/index.tsx`
- [ ] Implement `resources/js/components/pharmacy/batches/BatchList.tsx`
- [ ] Implement `resources/js/components/pharmacy/batches/BatchColumns.tsx`
- [ ] Implement `resources/js/components/pharmacy/batches/BatchFormModal.tsx`
- [ ] Implement `resources/js/pages/pharmacy/batches/create.tsx` and `edit.tsx`
- [ ] Implement dialogs: UseBatchStockDialog + AdjustBatchStockDialog
- [ ] Implement `resources/js/pages/pharmacy/batches/show.tsx`
- [ ] Typecheck/build and do a quick manual smoke test in browser

