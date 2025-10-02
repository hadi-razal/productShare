// To get the subcription status of the userrr

async function checkUserSubscription(subId:string) {
  const res = await fetch("/api/sub-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subId }),
  });

  const data = await res.json();
  return data.active;
}
