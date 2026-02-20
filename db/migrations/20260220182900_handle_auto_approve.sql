create or replace function handle_auto_approve()
returns setof leave_requests
as $$
begin
  return query
  update leave_requests
  set 
    status = 'approved',
    approver_id = user_id,
    approved_at = now(),
    updated_at = now()
  where 
    status = 'pending'
    and start_date = (now() at time zone 'Asia/Shanghai')::date
  returning *;
end;
$$ language plpgsql;