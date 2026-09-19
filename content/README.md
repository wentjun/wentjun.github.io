# Updating the travel record

Edit [travel.json](travel.json) for all routine updates. Change `currentLocation`
separately; adding a visit never changes where you are now.

Add an object to `visits`, for example:

```json
{
  "id": "tokyo-2027-05",
  "city": "Tokyo",
  "country": "Japan",
  "month": "2027-05",
  "latitude": 35.68,
  "longitude": 139.69
}
```

- Use unique IDs, including for return visits and `currentLocation`.
- Use `YYYY-MM` dates. Visits sort newest first, keeping file order within a month.
  Future months show “Heading to” automatically.
- Choose a country from the editor suggestions and supply approximate city coordinates.
- Add an optional `note`. Edit or delete an entry to change or remove it.

Follow the [development setup](../README.md#development) to preview
<http://localhost:3000/whereabouts>. The [production build](../README.md#production-build)
validates the data. Commit and deploy through the normal workflow to publish.

Country highlights update automatically. The generated schema and map assets need
no manual edits for travel updates.
