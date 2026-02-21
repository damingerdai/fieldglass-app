# Fieldglass CronJob Helm Chart

This Helm chart automates a daily synchronization task for the **Fieldglass App**. It triggers a specific API endpoint using `curl` within a Kubernetes CronJob.

---

## 🚀 Overview

- **Schedule**: Runs every day at **00:00 UTC**.
- **Action**: Triggers the sync API via `curl`.
- **Security**: The `Authorization Bearer Token` is stored securely in a Kubernetes **Secret** and injected as the `CRON_SECRET` environment variable.

## 🛠 Prerequisites

- **Kubernetes**: 1.19+ (Fully compatible with **K3s**)
- **Helm**: 3.0+
- **Network**: The cluster must have outbound access to `fieldglass-app.vercel.app`.

## ⚙️ Configuration

The following table lists the configurable parameters of the Fieldglass Cron chart and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `cronjob.schedule` | Cron schedule (UTC) | `"0 0 * * *"` |
| `cronjob.apiUrl` | The API endpoint to trigger | `https://fieldglass-app.vercel.app/api/cron` |
| `cronjob.cronSecret` | **Required**: Your Bearer Token | `""` |
| `image.repository` | Docker image for curl | `curlimages/curl` |
| `image.tag` | Image tag | `latest` |

## 📦 Installation

### 1. Basic Installation
To install the chart with the release name `fieldglass-task` and provide your secret token:

```bash
helm install fieldglass-task ./charts/fieldglass-cron \
  --set cronjob.cronSecret="xxxxx"
```

### 2. Verify Deployment

Check if the CronJob is successfully created:

```bash
kubectl get cronjob fieldglass-task-fieldglass-cron

```

### 3. Manual Execution (Testing)

If you want to trigger the job immediately instead of waiting for midnight (UTC):

```bash
kubectl create job --from=cronjob/fieldglass-task-fieldglass-cron test-run-01

```

## 🔍 Troubleshooting

* **Check Logs**: Find the pod created by the job and run:
```bash
kubectl logs -l app.kubernetes.io/instance=fieldglass-task

```


* **Inspect Secret**: Ensure the secret is correctly populated:
```bash
kubectl get secret fieldglass-task-fieldglass-cron-secret -o yaml

```



---

## 📌 Versioning

* **Chart Version (`version`)**: `0.1.0` — Incremented when the deployment logic (YAML) changes.
* **App Version (`appVersion`)**: `1.0.0` — Reflects the version of the underlying application/API logic.
