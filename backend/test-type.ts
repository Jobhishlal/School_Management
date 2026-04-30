type Anything = ReturnType<typeof JSON.parse>; function test(data: Anything) { if (!(data.fullName as string).trim()) throw new Error(); }
